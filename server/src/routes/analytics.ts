import { MealItem, MealType } from '@prisma/client';
import { Router } from 'express';
import { prisma } from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { build7DayWindow } from '../utils/dates';
import {
  dailyAnalyticsQuerySchema,
  weeklyAnalyticsQuerySchema
} from '../validators/analytics';

const router = Router();

type Totals = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type WorkoutDaySummary = {
  date: string;
  sessions: number;
  sets: number;
  volume: number;
};

function emptyTotals(): Totals {
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };
}

function addItemToTotals(target: Totals, item: MealItem) {
  target.calories += item.calories;
  target.protein += item.protein ?? 0;
  target.carbs += item.carbs ?? 0;
  target.fats += item.fats ?? 0;
}

router.get(
  '/daily',
  asyncHandler(async (req, res) => {
    const { date } = dailyAnalyticsQuerySchema.parse(req.query);
    const userId = req.user!.id;

    const entries = await prisma.mealEntry.findMany({
      where: { userId, date },
      include: { items: true }
    });

    const breakdown: Record<MealType, Totals> = {
      BREAKFAST: emptyTotals(),
      LUNCH: emptyTotals(),
      DINNER: emptyTotals(),
      SNACKS: emptyTotals()
    };
    const totals = emptyTotals();

    for (const entry of entries) {
      for (const item of entry.items) {
        addItemToTotals(breakdown[entry.mealType], item);
        addItemToTotals(totals, item);
      }
    }

    res.json({
      date,
      totals,
      breakdown
    });
  })
);

router.get(
  '/workouts',
  asyncHandler(async (req, res) => {
    const { start } = weeklyAnalyticsQuerySchema.parse(req.query);
    const userId = req.user!.id;
    const days = build7DayWindow(start);

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        date: { in: days }
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });

    const daySummaryMap = new Map<string, WorkoutDaySummary>(
      days.map((date) => [
        date,
        {
          date,
          sessions: 0,
          sets: 0,
          volume: 0
        }
      ])
    );

    const totals = {
      sessions: 0,
      exercises: 0,
      sets: 0,
      volume: 0
    };

    for (const session of sessions) {
      const day = daySummaryMap.get(session.date);
      if (!day) continue;

      day.sessions += 1;
      totals.sessions += 1;

      for (const exercise of session.exercises) {
        totals.exercises += 1;

        for (const set of exercise.sets) {
          const setVolume = (set.weight ?? 0) * set.reps;
          day.sets += 1;
          day.volume += setVolume;
          totals.sets += 1;
          totals.volume += setVolume;
        }
      }
    }

    res.json({
      start,
      end: days[6],
      days: days.map((date) => daySummaryMap.get(date)!),
      totals
    });
  })
);

router.get(
  '/weekly',
  asyncHandler(async (req, res) => {
    const { start } = weeklyAnalyticsQuerySchema.parse(req.query);
    const userId = req.user!.id;
    const days = build7DayWindow(start);

    const entries = await prisma.mealEntry.findMany({
      where: {
        userId,
        date: { in: days }
      },
      include: { items: true }
    });

    const dayTotalsMap = new Map<string, Totals>(
      days.map((date) => [date, emptyTotals()])
    );

    for (const entry of entries) {
      const totals = dayTotalsMap.get(entry.date);
      if (!totals) continue;

      for (const item of entry.items) {
        addItemToTotals(totals, item);
      }
    }

    const summary = days.map((date) => ({
      date,
      ...dayTotalsMap.get(date)!
    }));

    const totals = summary.reduce(
      (acc, day) => {
        acc.calories += day.calories;
        acc.protein += day.protein;
        acc.carbs += day.carbs;
        acc.fats += day.fats;
        return acc;
      },
      emptyTotals()
    );

    res.json({
      start,
      end: days[6],
      days: summary,
      totals
    });
  })
);

export default router;
