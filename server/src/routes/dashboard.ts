import { MealType } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { addDays, build7DayWindow, isValidISODate, todayISO } from '../utils/dates';
import { HttpError } from '../utils/httpError';

const router = Router();

const dashboardQuerySchema = z.object({
  date: z
    .string()
    .optional()
    .refine((value) => value === undefined || isValidISODate(value), 'Date must be a valid YYYY-MM-DD')
});

function caloriesForItems(items: { calories: number }[]) {
  return items.reduce((sum, item) => sum + item.calories, 0);
}

function countWorkoutStreak(dates: string[], anchorDate: string) {
  const uniqueDates = new Set(dates);
  let streak = 0;
  let cursor = anchorDate;

  while (uniqueDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { date: requestedDate } = dashboardQuerySchema.parse(req.query);
    const date = requestedDate || todayISO();
    const userId = req.user!.id;
    const weeklyWindow = build7DayWindow(addDays(date, -6));

    const [user, workoutCount, todayMeals, weeklyMeals, recentSessions, weeklySessions] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            displayName: true,
            fitnessGoal: true,
            dailyCalorieTarget: true,
            proteinTarget: true,
            carbsTarget: true,
            fatsTarget: true,
            currentWeight: true
          }
        }),
        prisma.workout.count(),
        prisma.mealEntry.findMany({
          where: { userId, date },
          include: { items: true },
          orderBy: { mealType: 'asc' }
        }),
        prisma.mealEntry.findMany({
          where: { userId, date: { in: weeklyWindow } },
          include: { items: true }
        }),
        prisma.workoutSession.findMany({
          where: { userId },
          take: 4,
          orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
          include: {
            exercises: {
              orderBy: { sortOrder: 'asc' },
              include: {
                workout: true,
                sets: {
                  orderBy: { setNumber: 'asc' }
                }
              }
            }
          }
        }),
        prisma.workoutSession.findMany({
          where: {
            userId,
            date: { in: weeklyWindow }
          },
          include: {
            exercises: {
              include: {
                sets: true
              }
            }
          }
        })
      ]);

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const todayMealSummary: Record<MealType, { mealType: MealType; itemCount: number; calories: number }> = {
      BREAKFAST: { mealType: MealType.BREAKFAST, itemCount: 0, calories: 0 },
      LUNCH: { mealType: MealType.LUNCH, itemCount: 0, calories: 0 },
      DINNER: { mealType: MealType.DINNER, itemCount: 0, calories: 0 },
      SNACKS: { mealType: MealType.SNACKS, itemCount: 0, calories: 0 }
    };

    for (const meal of todayMeals) {
      const summary = todayMealSummary[meal.mealType];
      summary.itemCount += meal.items.length;
      summary.calories += caloriesForItems(meal.items);
    }

    const weeklyCaloriesMap = new Map<string, number>(weeklyWindow.map((day) => [day, 0]));
    for (const meal of weeklyMeals) {
      weeklyCaloriesMap.set(
        meal.date,
        (weeklyCaloriesMap.get(meal.date) || 0) + caloriesForItems(meal.items)
      );
    }

    const weeklyWorkoutMap = new Map<string, { date: string; sessions: number; volume: number }>(
      weeklyWindow.map((day) => [day, { date: day, sessions: 0, volume: 0 }])
    );

    let completedSetsThisWeek = 0;
    for (const session of weeklySessions) {
      const summary = weeklyWorkoutMap.get(session.date);
      if (!summary) continue;

      summary.sessions += 1;

      for (const exercise of session.exercises) {
        for (const set of exercise.sets) {
          completedSetsThisWeek += 1;
          summary.volume += (set.weight ?? 0) * set.reps;
        }
      }
    }

    const caloriesLogged = Object.values(todayMealSummary).reduce(
      (sum, meal) => sum + meal.calories,
      0
    );
    const mealsLogged = Object.values(todayMealSummary).reduce(
      (sum, meal) => sum + meal.itemCount,
      0
    );

    res.json({
      date,
      user,
      overview: {
        caloriesLogged,
        calorieTarget: user.dailyCalorieTarget,
        remainingCalories: user.dailyCalorieTarget - caloriesLogged,
        mealsLogged,
        workoutsThisWeek: weeklySessions.length,
        completedSetsThisWeek,
        exerciseLibraryCount: workoutCount,
        workoutStreak: countWorkoutStreak(
          weeklySessions.map((session) => session.date),
          date
        )
      },
      todayMeals: Object.values(todayMealSummary),
      weeklyCalories: weeklyWindow.map((day) => ({
        date: day,
        calories: weeklyCaloriesMap.get(day) || 0
      })),
      weeklyWorkouts: weeklyWindow.map((day) => weeklyWorkoutMap.get(day)!),
      recentSessions: recentSessions.map((session) => ({
        id: session.id,
        title: session.title,
        date: session.date,
        notes: session.notes,
        durationMinutes: session.durationMinutes,
        exerciseCount: session.exercises.length,
        totalSets: session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0),
        exercises: session.exercises.map((exercise) => ({
          id: exercise.id,
          notes: exercise.notes,
          workout: {
            id: exercise.workout.id,
            name: exercise.workout.name,
            targetMuscle: exercise.workout.targetMuscle
          },
          sets: exercise.sets
        }))
      }))
    });
  })
);

export default router;
