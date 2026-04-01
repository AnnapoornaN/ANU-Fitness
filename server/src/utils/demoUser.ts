import { Difficulty, FitnessGoal, MealType, MuscleGroup } from '@prisma/client';
import { prisma } from '../prisma';
import { addDays, todayISO } from './dates';
import { hashPassword } from './password';

export const DEMO_USERNAME = 'demo_anu';
export const DEMO_PASSWORD = 'fitness123';

const demoWorkouts = [
  {
    name: 'Push-Up',
    targetMuscle: MuscleGroup.CHEST,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Keep a straight line from shoulders to heels and lower until chest is close to the floor.',
    videoLink: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
  },
  {
    name: 'Dumbbell Bench Press',
    targetMuscle: MuscleGroup.CHEST,
    equipment: 'Dumbbells + Bench',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Press dumbbells from chest level while keeping your shoulder blades retracted.',
    videoLink: 'https://www.youtube.com/watch?v=VmB1G1K7v94'
  },
  {
    name: 'Lat Pulldown',
    targetMuscle: MuscleGroup.BACK,
    equipment: 'Lat Pulldown Machine',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Pull the bar to your upper chest with control and keep the torso steady.',
    videoLink: null
  },
  {
    name: 'One-Arm Dumbbell Row',
    targetMuscle: MuscleGroup.BACK,
    equipment: 'Dumbbell + Bench',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Brace on the bench, row to the hip, and control the lowering phase.',
    videoLink: null
  },
  {
    name: 'Leg Press',
    targetMuscle: MuscleGroup.LEGS,
    equipment: 'Leg Press Machine',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Lower to a comfortable depth and press smoothly without bouncing.',
    videoLink: null
  },
  {
    name: 'Walking Lunge',
    targetMuscle: MuscleGroup.LEGS,
    equipment: 'Bodyweight or Dumbbells',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Step into each rep with balance and keep the torso upright.',
    videoLink: null
  },
  {
    name: 'Glute Bridge',
    targetMuscle: MuscleGroup.LEGS,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Drive through the heels and lift hips until the body forms a straight line.',
    videoLink: null
  },
  {
    name: 'Overhead Press',
    targetMuscle: MuscleGroup.SHOULDERS,
    equipment: 'Barbell/Dumbbells',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Press overhead with a braced core and controlled lockout.',
    videoLink: null
  },
  {
    name: 'Biceps Curl',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Dumbbells/Barbell',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Keep elbows close to the torso and lower the weight under control.',
    videoLink: null
  },
  {
    name: 'Hammer Curl',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Dumbbells',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Use a neutral grip and avoid swinging through the movement.',
    videoLink: null
  },
  {
    name: 'Triceps Pushdown',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Cable Machine',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Keep elbows fixed and extend fully at the bottom of each rep.',
    videoLink: null
  },
  {
    name: 'Close-Grip Push-Up',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Bodyweight',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Keep elbows tucked in and press through the palms with control.',
    videoLink: null
  },
  {
    name: 'Plank',
    targetMuscle: MuscleGroup.CORE,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Hold a strong neutral spine and brace the core throughout the set.',
    videoLink: 'https://www.youtube.com/watch?v=ASdvN_XEl_c'
  }
] as const;

function buildDemoMealEntries() {
  const today = todayISO();
  const dayOffsets = [-6, -5, -4, -3, -2, -1, 0];

  return dayOffsets.flatMap((offset, index) => {
    const date = addDays(today, offset);
    const calorieBoost = index * 18;

    return [
      {
        date,
        mealType: MealType.BREAKFAST,
        items: [
          {
            name: 'Greek Yogurt Bowl',
            quantity: '1 bowl',
            calories: 320 + calorieBoost,
            protein: 24,
            carbs: 28,
            fats: 9
          }
        ]
      },
      {
        date,
        mealType: MealType.LUNCH,
        items: [
          {
            name: 'Chicken Rice Plate',
            quantity: '1 plate',
            calories: 560 + calorieBoost,
            protein: 38,
            carbs: 54,
            fats: 15
          }
        ]
      },
      {
        date,
        mealType: MealType.DINNER,
        items: [
          {
            name: 'Salmon and Potatoes',
            quantity: '1 serving',
            calories: 610 + calorieBoost,
            protein: 42,
            carbs: 43,
            fats: 24
          }
        ]
      },
      {
        date,
        mealType: MealType.SNACKS,
        items: [
          {
            name: 'Protein Shake',
            quantity: '1 bottle',
            calories: 190,
            protein: 26,
            carbs: 8,
            fats: 5
          }
        ]
      }
    ];
  });
}

const workoutSessionTemplates = [
  {
    offset: -5,
    title: 'Upper Push Focus',
    durationMinutes: 48,
    notes: 'Steady pressing session with clean form.',
    exercises: [
      { name: 'Dumbbell Bench Press', sets: [{ reps: 12, weight: 12 }, { reps: 10, weight: 14 }, { reps: 8, weight: 14 }] },
      { name: 'Overhead Press', sets: [{ reps: 12, weight: 10 }, { reps: 10, weight: 12 }] },
      { name: 'Triceps Pushdown', sets: [{ reps: 15, weight: 18 }, { reps: 12, weight: 20 }] }
    ]
  },
  {
    offset: -3,
    title: 'Lower Body Strength',
    durationMinutes: 52,
    notes: 'Kept the tempo slow on every leg movement.',
    exercises: [
      { name: 'Leg Press', sets: [{ reps: 12, weight: 80 }, { reps: 10, weight: 95 }, { reps: 8, weight: 105 }] },
      { name: 'Walking Lunge', sets: [{ reps: 12, weight: 10 }, { reps: 12, weight: 10 }] },
      { name: 'Glute Bridge', sets: [{ reps: 15, weight: 20 }, { reps: 15, weight: 20 }] }
    ]
  },
  {
    offset: -1,
    title: 'Pull and Core',
    durationMinutes: 44,
    notes: 'Shorter session focused on back engagement.',
    exercises: [
      { name: 'Lat Pulldown', sets: [{ reps: 12, weight: 30 }, { reps: 12, weight: 35 }, { reps: 10, weight: 35 }] },
      { name: 'One-Arm Dumbbell Row', sets: [{ reps: 10, weight: 12 }, { reps: 10, weight: 12 }] },
      { name: 'Plank', sets: [{ reps: 1, weight: 0 }, { reps: 1, weight: 0 }] }
    ]
  },
  {
    offset: 0,
    title: 'Arms Finishers',
    durationMinutes: 36,
    notes: 'Quick demo session logged for today.',
    exercises: [
      { name: 'Biceps Curl', sets: [{ reps: 12, weight: 8 }, { reps: 10, weight: 10 }] },
      { name: 'Hammer Curl', sets: [{ reps: 12, weight: 8 }, { reps: 10, weight: 8 }] },
      { name: 'Close-Grip Push-Up', sets: [{ reps: 12, weight: 0 }, { reps: 10, weight: 0 }] }
    ]
  }
] as const;

async function ensureWorkoutCatalog() {
  const workoutsByName = new Map<string, { id: number; name: string }>();

  for (const workout of demoWorkouts) {
    let existing = await prisma.workout.findFirst({
      where: { name: workout.name },
      select: { id: true, name: true }
    });

    if (!existing) {
      existing = await prisma.workout.create({
        data: workout,
        select: { id: true, name: true }
      });
    }

    workoutsByName.set(existing.name, existing);
  }

  return workoutsByName;
}

async function ensureDemoMeals(userId: number) {
  const mealCount = await prisma.mealEntry.count({
    where: { userId }
  });

  if (mealCount > 0) {
    return;
  }

  for (const meal of buildDemoMealEntries()) {
    await prisma.mealEntry.create({
      data: {
        userId,
        date: meal.date,
        mealType: meal.mealType,
        items: {
          create: meal.items
        }
      }
    });
  }
}

async function ensureDemoWorkoutSessions(userId: number, workoutsByName: Map<string, { id: number }>) {
  const sessionCount = await prisma.workoutSession.count({
    where: { userId }
  });

  if (sessionCount > 0) {
    return;
  }

  for (const template of workoutSessionTemplates) {
    await prisma.workoutSession.create({
      data: {
        userId,
        title: template.title,
        date: addDays(todayISO(), template.offset),
        durationMinutes: template.durationMinutes,
        notes: template.notes,
        exercises: {
          create: template.exercises.map((exercise, exerciseIndex) => ({
            workoutId: workoutsByName.get(exercise.name)!.id,
            sortOrder: exerciseIndex,
            sets: {
              create: exercise.sets.map((set, setIndex) => ({
                setNumber: setIndex + 1,
                reps: set.reps,
                weight: set.weight
              }))
            }
          }))
        }
      }
    });
  }
}

export async function ensureDemoData() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { username: DEMO_USERNAME },
    update: {
      displayName: 'Anu Demo',
      passwordHash,
      fitnessGoal: FitnessGoal.MUSCLE_GAIN,
      dailyCalorieTarget: 2300,
      proteinTarget: 160,
      carbsTarget: 240,
      fatsTarget: 70,
      currentWeight: 62.5
    },
    create: {
      username: DEMO_USERNAME,
      displayName: 'Anu Demo',
      passwordHash,
      fitnessGoal: FitnessGoal.MUSCLE_GAIN,
      dailyCalorieTarget: 2300,
      proteinTarget: 160,
      carbsTarget: 240,
      fatsTarget: 70,
      currentWeight: 62.5
    }
  });

  const workoutsByName = await ensureWorkoutCatalog();
  await ensureDemoMeals(user.id);
  await ensureDemoWorkoutSessions(user.id, workoutsByName);

  return user;
}
