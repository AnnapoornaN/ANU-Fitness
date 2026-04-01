import {
  Difficulty,
  FitnessGoal,
  MealType,
  MuscleGroup,
  PrismaClient
} from '@prisma/client';
import { addDays, todayISO } from '../src/utils/dates';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

const workouts = [
  {
    name: 'Push-Up',
    targetMuscle: MuscleGroup.CHEST,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Keep a straight line from shoulders to heels and lower until chest is close to floor.',
    videoLink: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
  },
  {
    name: 'Dumbbell Bench Press',
    targetMuscle: MuscleGroup.CHEST,
    equipment: 'Dumbbells + Bench',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Press dumbbells up from chest level while keeping shoulder blades retracted.',
    videoLink: 'https://www.youtube.com/watch?v=VmB1G1K7v94'
  },
  {
    name: 'Incline Push-Up',
    targetMuscle: MuscleGroup.CHEST,
    equipment: 'Bench/Box',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Hands elevated on a stable surface, lower chest toward edge, then press back up.',
    videoLink: null
  },
  {
    name: 'Cable Fly',
    targetMuscle: MuscleGroup.CHEST,
    equipment: 'Cable Machine',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Bring handles together in front of chest with slight elbow bend, then control back.',
    videoLink: null
  },
  {
    name: 'Chest Dips',
    targetMuscle: MuscleGroup.CHEST,
    equipment: 'Dip Bars',
    difficulty: Difficulty.ADVANCED,
    instructions: 'Lean slightly forward, bend elbows, and dip until upper arms are near parallel.',
    videoLink: null
  },

  {
    name: 'Pull-Up',
    targetMuscle: MuscleGroup.BACK,
    equipment: 'Pull-Up Bar',
    difficulty: Difficulty.ADVANCED,
    instructions: 'Pull chest toward bar by driving elbows down and back; lower under control.',
    videoLink: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
  },
  {
    name: 'One-Arm Dumbbell Row',
    targetMuscle: MuscleGroup.BACK,
    equipment: 'Dumbbell + Bench',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Support one hand on bench, row dumbbell to hip while keeping torso stable.',
    videoLink: null
  },
  {
    name: 'Lat Pulldown',
    targetMuscle: MuscleGroup.BACK,
    equipment: 'Lat Pulldown Machine',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Pull bar to upper chest while keeping torso mostly upright; avoid jerking.',
    videoLink: null
  },
  {
    name: 'Seated Cable Row',
    targetMuscle: MuscleGroup.BACK,
    equipment: 'Cable Machine',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Row handle toward lower ribs, squeeze shoulder blades, then return slowly.',
    videoLink: null
  },
  {
    name: 'Superman Hold',
    targetMuscle: MuscleGroup.BACK,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Lift arms and legs off floor while lying prone, hold and breathe steadily.',
    videoLink: null
  },

  {
    name: 'Bodyweight Squat',
    targetMuscle: MuscleGroup.LEGS,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Sit hips back and down, keep chest up, then drive through mid-foot to stand.',
    videoLink: 'https://www.youtube.com/watch?v=aclHkVaku9U'
  },
  {
    name: 'Walking Lunge',
    targetMuscle: MuscleGroup.LEGS,
    equipment: 'Bodyweight or Dumbbells',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Step forward into lunge, back knee close to floor, alternate legs while walking.',
    videoLink: null
  },
  {
    name: 'Romanian Deadlift',
    targetMuscle: MuscleGroup.LEGS,
    equipment: 'Barbell/Dumbbells',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Hinge at hips with soft knees, keep back neutral, then return by driving hips forward.',
    videoLink: null
  },
  {
    name: 'Leg Press',
    targetMuscle: MuscleGroup.LEGS,
    equipment: 'Leg Press Machine',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Lower platform until knees are comfortable depth, press back without locking hard.',
    videoLink: null
  },
  {
    name: 'Glute Bridge',
    targetMuscle: MuscleGroup.LEGS,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Drive heels into floor and lift hips until body forms a straight line.',
    videoLink: null
  },

  {
    name: 'Overhead Press',
    targetMuscle: MuscleGroup.SHOULDERS,
    equipment: 'Barbell/Dumbbells',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Press weight overhead while keeping ribs down and core braced.',
    videoLink: null
  },
  {
    name: 'Lateral Raise',
    targetMuscle: MuscleGroup.SHOULDERS,
    equipment: 'Dumbbells',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Raise arms out to sides to shoulder height with slight elbow bend.',
    videoLink: null
  },
  {
    name: 'Front Raise',
    targetMuscle: MuscleGroup.SHOULDERS,
    equipment: 'Dumbbells/Plate',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Lift weight in front to shoulder height, avoid swinging.',
    videoLink: null
  },
  {
    name: 'Rear Delt Fly',
    targetMuscle: MuscleGroup.SHOULDERS,
    equipment: 'Dumbbells/Cables',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Hinge forward and open arms wide, squeezing rear shoulders at top.',
    videoLink: null
  },
  {
    name: 'Pike Push-Up',
    targetMuscle: MuscleGroup.SHOULDERS,
    equipment: 'Bodyweight',
    difficulty: Difficulty.ADVANCED,
    instructions: 'From pike position, lower head toward floor and press up through shoulders.',
    videoLink: null
  },

  {
    name: 'Biceps Curl',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Dumbbells/Barbell',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Curl weight while elbows stay close to torso; lower slowly.',
    videoLink: null
  },
  {
    name: 'Hammer Curl',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Dumbbells',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Curl with neutral grip to train brachialis and forearms.',
    videoLink: null
  },
  {
    name: 'Triceps Pushdown',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Cable Machine',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Keep elbows pinned and extend arms fully downward.',
    videoLink: null
  },
  {
    name: 'Overhead Triceps Extension',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Dumbbell/Cable',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Lower weight behind head with elbows pointed up, then extend.',
    videoLink: null
  },
  {
    name: 'Close-Grip Push-Up',
    targetMuscle: MuscleGroup.ARMS,
    equipment: 'Bodyweight',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Hands under shoulders, keep elbows close to body during press.',
    videoLink: null
  },

  {
    name: 'Plank',
    targetMuscle: MuscleGroup.CORE,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Hold forearm plank with neutral spine and tight glutes.',
    videoLink: 'https://www.youtube.com/watch?v=ASdvN_XEl_c'
  },
  {
    name: 'Dead Bug',
    targetMuscle: MuscleGroup.CORE,
    equipment: 'Bodyweight',
    difficulty: Difficulty.BEGINNER,
    instructions: 'Alternate extending opposite arm and leg while keeping low back flat.',
    videoLink: null
  },
  {
    name: 'Russian Twist',
    targetMuscle: MuscleGroup.CORE,
    equipment: 'Bodyweight/Plate',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'Lean back slightly and rotate torso side to side with control.',
    videoLink: null
  },
  {
    name: 'Mountain Climber',
    targetMuscle: MuscleGroup.CORE,
    equipment: 'Bodyweight',
    difficulty: Difficulty.INTERMEDIATE,
    instructions: 'From high plank, drive knees alternately toward chest at steady pace.',
    videoLink: null
  },
  {
    name: 'Hanging Knee Raise',
    targetMuscle: MuscleGroup.CORE,
    equipment: 'Pull-Up Bar',
    difficulty: Difficulty.ADVANCED,
    instructions: 'Hang from bar and lift knees toward chest without swinging.',
    videoLink: null
  }
];

const demoUsername = 'demo_anu';
const demoPassword = 'fitness123';

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

async function seedDemoUser() {
  const passwordHash = await hashPassword(demoPassword);
  const user = await prisma.user.upsert({
    where: { username: demoUsername },
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
      username: demoUsername,
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

  await prisma.mealEntry.deleteMany({
    where: { userId: user.id }
  });
  await prisma.workoutSession.deleteMany({
    where: { userId: user.id }
  });

  const workoutsByName = new Map(
    (
      await prisma.workout.findMany({
        select: {
          id: true,
          name: true
        }
      })
    ).map((workout) => [workout.name, workout.id])
  );

  for (const meal of buildDemoMealEntries()) {
    await prisma.mealEntry.create({
      data: {
        userId: user.id,
        date: meal.date,
        mealType: meal.mealType,
        items: {
          create: meal.items
        }
      }
    });
  }

  const workoutSessions = [
    {
      date: addDays(todayISO(), -5),
      title: 'Upper Push Focus',
      durationMinutes: 48,
      notes: 'Steady pressing session with clean form.',
      exercises: [
        {
          workoutId: workoutsByName.get('Dumbbell Bench Press')!,
          sets: [
            { reps: 12, weight: 12 },
            { reps: 10, weight: 14 },
            { reps: 8, weight: 14 }
          ]
        },
        {
          workoutId: workoutsByName.get('Overhead Press')!,
          sets: [
            { reps: 12, weight: 10 },
            { reps: 10, weight: 12 }
          ]
        },
        {
          workoutId: workoutsByName.get('Triceps Pushdown')!,
          sets: [
            { reps: 15, weight: 18 },
            { reps: 12, weight: 20 }
          ]
        }
      ]
    },
    {
      date: addDays(todayISO(), -3),
      title: 'Lower Body Strength',
      durationMinutes: 52,
      notes: 'Kept the tempo slow on every leg movement.',
      exercises: [
        {
          workoutId: workoutsByName.get('Leg Press')!,
          sets: [
            { reps: 12, weight: 80 },
            { reps: 10, weight: 95 },
            { reps: 8, weight: 105 }
          ]
        },
        {
          workoutId: workoutsByName.get('Walking Lunge')!,
          sets: [
            { reps: 12, weight: 10 },
            { reps: 12, weight: 10 }
          ]
        },
        {
          workoutId: workoutsByName.get('Glute Bridge')!,
          sets: [
            { reps: 15, weight: 20 },
            { reps: 15, weight: 20 }
          ]
        }
      ]
    },
    {
      date: addDays(todayISO(), -1),
      title: 'Pull and Core',
      durationMinutes: 44,
      notes: 'Shorter session focused on back engagement.',
      exercises: [
        {
          workoutId: workoutsByName.get('Lat Pulldown')!,
          sets: [
            { reps: 12, weight: 30 },
            { reps: 12, weight: 35 },
            { reps: 10, weight: 35 }
          ]
        },
        {
          workoutId: workoutsByName.get('One-Arm Dumbbell Row')!,
          sets: [
            { reps: 10, weight: 12 },
            { reps: 10, weight: 12 }
          ]
        },
        {
          workoutId: workoutsByName.get('Plank')!,
          sets: [
            { reps: 1, weight: 0 },
            { reps: 1, weight: 0 }
          ]
        }
      ]
    },
    {
      date: todayISO(),
      title: 'Arms Finishers',
      durationMinutes: 36,
      notes: 'Quick demo session logged for today.',
      exercises: [
        {
          workoutId: workoutsByName.get('Biceps Curl')!,
          sets: [
            { reps: 12, weight: 8 },
            { reps: 10, weight: 10 }
          ]
        },
        {
          workoutId: workoutsByName.get('Hammer Curl')!,
          sets: [
            { reps: 12, weight: 8 },
            { reps: 10, weight: 8 }
          ]
        },
        {
          workoutId: workoutsByName.get('Close-Grip Push-Up')!,
          sets: [
            { reps: 12, weight: 0 },
            { reps: 10, weight: 0 }
          ]
        }
      ]
    }
  ];

  for (const session of workoutSessions) {
    await prisma.workoutSession.create({
      data: {
        userId: user.id,
        title: session.title,
        date: session.date,
        durationMinutes: session.durationMinutes,
        notes: session.notes,
        exercises: {
          create: session.exercises.map((exercise, exerciseIndex) => ({
            workoutId: exercise.workoutId,
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

  console.log(`Seeded demo account: ${demoUsername} / ${demoPassword}`);
}

async function main() {
  await prisma.workout.deleteMany();
  await prisma.workout.createMany({ data: workouts });
  await seedDemoUser();
  console.log(`Seeded ${workouts.length} workouts.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
