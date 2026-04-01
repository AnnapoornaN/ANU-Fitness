import {
  AuthResponse,
  DailyAnalyticsResponse,
  FitnessGoal,
  MealEntry,
  MealItem,
  MealItemInput,
  MealType,
  Profile,
  Totals,
  User,
  WeeklyAnalyticsResponse,
  Workout,
  WorkoutAnalyticsResponse,
  WorkoutSession,
  WorkoutSessionInput,
  DashboardResponse
} from '../types';
import { enableDemoMode } from './auth';
import { addDaysISO, todayISO } from './date';

type DemoState = {
  profile: Profile;
  workouts: Workout[];
  meals: MealEntry[];
  workoutSessions: WorkoutSession[];
  nextIds: {
    mealEntry: number;
    mealItem: number;
    workoutSession: number;
    sessionExercise: number;
    workoutSet: number;
  };
};

const DEMO_STATE_KEY = 'anu_fitness_demo_state';
const DEMO_TOKEN = 'offline-demo-token';

function nowIso() {
  return new Date().toISOString();
}

function emptyTotals(): Totals {
  return { calories: 0, protein: 0, carbs: 0, fats: 0 };
}

function addItemToTotals(target: Totals, item: MealItem) {
  target.calories += item.calories;
  target.protein += item.protein ?? 0;
  target.carbs += item.carbs ?? 0;
  target.fats += item.fats ?? 0;
}

function buildState(): DemoState {
  const profile: Profile = {
    id: 1,
    username: 'demo_anu',
    displayName: 'Anu Demo',
    fitnessGoal: 'MUSCLE_GAIN',
    dailyCalorieTarget: 2300,
    proteinTarget: 160,
    carbsTarget: 240,
    fatsTarget: 70,
    currentWeight: 62.5,
    createdAt: nowIso()
  };

  const workouts: Workout[] = [
    {
      id: 1,
      name: 'Push-Up',
      targetMuscle: 'CHEST',
      equipment: 'Bodyweight',
      difficulty: 'BEGINNER',
      instructions: 'Keep a straight line from shoulders to heels and lower until chest is close to the floor.',
      videoLink: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
      createdAt: nowIso()
    },
    {
      id: 2,
      name: 'Dumbbell Bench Press',
      targetMuscle: 'CHEST',
      equipment: 'Dumbbells + Bench',
      difficulty: 'INTERMEDIATE',
      instructions: 'Press dumbbells from chest level while keeping shoulder blades retracted.',
      videoLink: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
      createdAt: nowIso()
    },
    {
      id: 3,
      name: 'Lat Pulldown',
      targetMuscle: 'BACK',
      equipment: 'Lat Pulldown Machine',
      difficulty: 'BEGINNER',
      instructions: 'Pull the bar to your upper chest with control and keep the torso steady.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 4,
      name: 'One-Arm Dumbbell Row',
      targetMuscle: 'BACK',
      equipment: 'Dumbbell + Bench',
      difficulty: 'INTERMEDIATE',
      instructions: 'Brace on the bench, row to the hip, and control the lowering phase.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 5,
      name: 'Leg Press',
      targetMuscle: 'LEGS',
      equipment: 'Leg Press Machine',
      difficulty: 'BEGINNER',
      instructions: 'Lower to a comfortable depth and press smoothly without bouncing.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 6,
      name: 'Walking Lunge',
      targetMuscle: 'LEGS',
      equipment: 'Bodyweight or Dumbbells',
      difficulty: 'INTERMEDIATE',
      instructions: 'Step into each rep with balance and keep the torso upright.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 7,
      name: 'Glute Bridge',
      targetMuscle: 'LEGS',
      equipment: 'Bodyweight',
      difficulty: 'BEGINNER',
      instructions: 'Drive through the heels and lift hips until the body forms a straight line.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 8,
      name: 'Overhead Press',
      targetMuscle: 'SHOULDERS',
      equipment: 'Barbell/Dumbbells',
      difficulty: 'INTERMEDIATE',
      instructions: 'Press overhead with a braced core and controlled lockout.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 9,
      name: 'Biceps Curl',
      targetMuscle: 'ARMS',
      equipment: 'Dumbbells/Barbell',
      difficulty: 'BEGINNER',
      instructions: 'Keep elbows close to the torso and lower the weight under control.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 10,
      name: 'Hammer Curl',
      targetMuscle: 'ARMS',
      equipment: 'Dumbbells',
      difficulty: 'BEGINNER',
      instructions: 'Use a neutral grip and avoid swinging through the movement.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 11,
      name: 'Triceps Pushdown',
      targetMuscle: 'ARMS',
      equipment: 'Cable Machine',
      difficulty: 'BEGINNER',
      instructions: 'Keep elbows fixed and extend fully at the bottom of each rep.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 12,
      name: 'Close-Grip Push-Up',
      targetMuscle: 'ARMS',
      equipment: 'Bodyweight',
      difficulty: 'INTERMEDIATE',
      instructions: 'Keep elbows tucked in and press through the palms with control.',
      videoLink: null,
      createdAt: nowIso()
    },
    {
      id: 13,
      name: 'Plank',
      targetMuscle: 'CORE',
      equipment: 'Bodyweight',
      difficulty: 'BEGINNER',
      instructions: 'Hold a strong neutral spine and brace the core throughout the set.',
      videoLink: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
      createdAt: nowIso()
    }
  ];

  const meals: MealEntry[] = [];
  let mealEntryId = 1;
  let mealItemId = 1;
  const templates: Array<{ mealType: MealType; name: string; quantity: string; calories: number; protein: number; carbs: number; fats: number }> = [
    { mealType: 'BREAKFAST', name: 'Greek Yogurt Bowl', quantity: '1 bowl', calories: 320, protein: 24, carbs: 28, fats: 9 },
    { mealType: 'LUNCH', name: 'Chicken Rice Plate', quantity: '1 plate', calories: 560, protein: 38, carbs: 54, fats: 15 },
    { mealType: 'DINNER', name: 'Salmon and Potatoes', quantity: '1 serving', calories: 610, protein: 42, carbs: 43, fats: 24 },
    { mealType: 'SNACKS', name: 'Protein Shake', quantity: '1 bottle', calories: 190, protein: 26, carbs: 8, fats: 5 }
  ];

  for (let offset = -6; offset <= 0; offset += 1) {
    const date = addDaysISO(todayISO(), offset);
    const boost = (offset + 6) * 18;
    for (const template of templates) {
      meals.push({
        id: mealEntryId,
        userId: profile.id,
        date,
        mealType: template.mealType,
        createdAt: nowIso(),
        items: [
          {
            id: mealItemId,
            mealEntryId,
            name: template.name,
            quantity: template.quantity,
            calories: template.calories + boost,
            protein: template.protein,
            carbs: template.carbs,
            fats: template.fats
          }
        ]
      });
      mealEntryId += 1;
      mealItemId += 1;
    }
  }

  const workoutById = new Map(workouts.map((workout) => [workout.id, workout]));
  let workoutSessionId = 1;
  let sessionExerciseId = 1;
  let workoutSetId = 1;

  const workoutSessions: WorkoutSession[] = [
    {
      id: workoutSessionId++,
      title: 'Upper Push Focus',
      date: addDaysISO(todayISO(), -5),
      notes: 'Steady pressing session with clean form.',
      durationMinutes: 48,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      exercises: [
        { workoutId: 2, sets: [{ reps: 12, weight: 12 }, { reps: 10, weight: 14 }, { reps: 8, weight: 14 }] },
        { workoutId: 8, sets: [{ reps: 12, weight: 10 }, { reps: 10, weight: 12 }] },
        { workoutId: 11, sets: [{ reps: 15, weight: 18 }, { reps: 12, weight: 20 }] }
      ].map((exercise, index) => ({
        id: sessionExerciseId++,
        notes: null,
        sortOrder: index,
        workout: workoutById.get(exercise.workoutId)!,
        sets: exercise.sets.map((set, setIndex) => ({
          id: workoutSetId++,
          setNumber: setIndex + 1,
          reps: set.reps,
          weight: set.weight
        }))
      }))
    },
    {
      id: workoutSessionId++,
      title: 'Lower Body Strength',
      date: addDaysISO(todayISO(), -3),
      notes: 'Kept the tempo slow on every leg movement.',
      durationMinutes: 52,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      exercises: [
        { workoutId: 5, sets: [{ reps: 12, weight: 80 }, { reps: 10, weight: 95 }, { reps: 8, weight: 105 }] },
        { workoutId: 6, sets: [{ reps: 12, weight: 10 }, { reps: 12, weight: 10 }] },
        { workoutId: 7, sets: [{ reps: 15, weight: 20 }, { reps: 15, weight: 20 }] }
      ].map((exercise, index) => ({
        id: sessionExerciseId++,
        notes: null,
        sortOrder: index,
        workout: workoutById.get(exercise.workoutId)!,
        sets: exercise.sets.map((set, setIndex) => ({
          id: workoutSetId++,
          setNumber: setIndex + 1,
          reps: set.reps,
          weight: set.weight
        }))
      }))
    },
    {
      id: workoutSessionId++,
      title: 'Pull and Core',
      date: addDaysISO(todayISO(), -1),
      notes: 'Shorter session focused on back engagement.',
      durationMinutes: 44,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      exercises: [
        { workoutId: 3, sets: [{ reps: 12, weight: 30 }, { reps: 12, weight: 35 }, { reps: 10, weight: 35 }] },
        { workoutId: 4, sets: [{ reps: 10, weight: 12 }, { reps: 10, weight: 12 }] },
        { workoutId: 13, sets: [{ reps: 1, weight: 0 }, { reps: 1, weight: 0 }] }
      ].map((exercise, index) => ({
        id: sessionExerciseId++,
        notes: null,
        sortOrder: index,
        workout: workoutById.get(exercise.workoutId)!,
        sets: exercise.sets.map((set, setIndex) => ({
          id: workoutSetId++,
          setNumber: setIndex + 1,
          reps: set.reps,
          weight: set.weight
        }))
      }))
    },
    {
      id: workoutSessionId++,
      title: 'Arms Finishers',
      date: todayISO(),
      notes: 'Quick demo session logged for today.',
      durationMinutes: 36,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      exercises: [
        { workoutId: 9, sets: [{ reps: 12, weight: 8 }, { reps: 10, weight: 10 }] },
        { workoutId: 10, sets: [{ reps: 12, weight: 8 }, { reps: 10, weight: 8 }] },
        { workoutId: 12, sets: [{ reps: 12, weight: 0 }, { reps: 10, weight: 0 }] }
      ].map((exercise, index) => ({
        id: sessionExerciseId++,
        notes: null,
        sortOrder: index,
        workout: workoutById.get(exercise.workoutId)!,
        sets: exercise.sets.map((set, setIndex) => ({
          id: workoutSetId++,
          setNumber: setIndex + 1,
          reps: set.reps,
          weight: set.weight
        }))
      }))
    }
  ];

  return {
    profile,
    workouts,
    meals,
    workoutSessions,
    nextIds: {
      mealEntry: mealEntryId,
      mealItem: mealItemId,
      workoutSession: workoutSessionId,
      sessionExercise: sessionExerciseId,
      workoutSet: workoutSetId
    }
  };
}

function getState(): DemoState {
  const raw = localStorage.getItem(DEMO_STATE_KEY);
  if (!raw) {
    const state = buildState();
    localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
    return state;
  }

  try {
    return JSON.parse(raw) as DemoState;
  } catch {
    const state = buildState();
    localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
    return state;
  }
}

function setState(state: DemoState) {
  localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
}

function userFromProfile(profile: Profile): User {
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.displayName,
    fitnessGoal: profile.fitnessGoal
  };
}

export function demoLogin(): AuthResponse {
  enableDemoMode();
  const state = getState();
  return {
    token: DEMO_TOKEN,
    user: userFromProfile(state.profile)
  };
}

export function demoCurrentUser() {
  return { user: userFromProfile(getState().profile) };
}

export function demoGetHealth() {
  return { status: 'demo' };
}

export function demoGetWorkouts(muscles: string[]) {
  const state = getState();
  const normalized = muscles.map((muscle) => muscle.toUpperCase());
  return {
    workouts:
      normalized.length > 0
        ? state.workouts.filter((workout) => normalized.includes(workout.targetMuscle))
        : state.workouts
  };
}

export function demoGetMeals(date: string) {
  return {
    meals: getState().meals.filter((meal) => meal.date === date)
  };
}

export function demoCreateMealEntry(payload: {
  date: string;
  mealType: MealType;
  items: MealItemInput[];
}) {
  const state = getState();
  const mealId = state.nextIds.mealEntry++;
  const meal: MealEntry = {
    id: mealId,
    userId: state.profile.id,
    date: payload.date,
    mealType: payload.mealType,
    createdAt: nowIso(),
    items: payload.items.map((item) => ({
      id: state.nextIds.mealItem++,
      mealEntryId: mealId,
      name: item.name,
      quantity: item.quantity,
      calories: item.calories,
      protein: item.protein ?? null,
      carbs: item.carbs ?? null,
      fats: item.fats ?? null
    }))
  };
  state.meals.push(meal);
  setState(state);
  return { meal };
}

export function demoUpdateMealEntry(
  id: number,
  payload: { date: string; mealType: MealType; items: MealItemInput[] }
) {
  const state = getState();
  const index = state.meals.findIndex((meal) => meal.id === id);
  if (index === -1) {
    throw new Error('Meal entry not found');
  }
  state.meals[index] = {
    ...state.meals[index],
    date: payload.date,
    mealType: payload.mealType,
    items: payload.items.map((item) => ({
      id: state.nextIds.mealItem++,
      mealEntryId: id,
      name: item.name,
      quantity: item.quantity,
      calories: item.calories,
      protein: item.protein ?? null,
      carbs: item.carbs ?? null,
      fats: item.fats ?? null
    }))
  };
  setState(state);
  return { meal: state.meals[index] };
}

export function demoDeleteMealEntry(id: number) {
  const state = getState();
  state.meals = state.meals.filter((meal) => meal.id !== id);
  setState(state);
  return { message: 'Meal entry deleted' };
}

export function demoGetDailyAnalytics(date: string): DailyAnalyticsResponse {
  const entries = getState().meals.filter((meal) => meal.date === date);
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

  return { date, totals, breakdown };
}

export function demoGetWeeklyAnalytics(start: string): WeeklyAnalyticsResponse {
  const state = getState();
  const days = Array.from({ length: 7 }, (_, index) => addDaysISO(start, index));
  const summary = days.map((date) => {
    const totals = emptyTotals();
    state.meals
      .filter((meal) => meal.date === date)
      .forEach((meal) => meal.items.forEach((item) => addItemToTotals(totals, item)));
    return { date, ...totals };
  });

  const totals = summary.reduce(
    (acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fats: acc.fats + day.fats
    }),
    emptyTotals()
  );

  return {
    start,
    end: days[6],
    days: summary,
    totals
  };
}

export function demoGetWorkoutAnalytics(start: string): WorkoutAnalyticsResponse {
  const state = getState();
  const days = Array.from({ length: 7 }, (_, index) => addDaysISO(start, index));
  const summaries = days.map((date) => {
    const sessions = state.workoutSessions.filter((session) => session.date === date);
    const sets = sessions.reduce(
      (sum, session) => sum + session.exercises.reduce((inner, exercise) => inner + exercise.sets.length, 0),
      0
    );
    const volume = sessions.reduce(
      (sum, session) =>
        sum +
        session.exercises.reduce(
          (exerciseSum, exercise) =>
            exerciseSum +
            exercise.sets.reduce((setSum, set) => setSum + (set.weight ?? 0) * set.reps, 0),
          0
        ),
      0
    );
    return { date, sessions: sessions.length, sets, volume };
  });

  return {
    start,
    end: days[6],
    days: summaries,
    totals: {
      sessions: summaries.reduce((sum, day) => sum + day.sessions, 0),
      exercises: state.workoutSessions
        .filter((session) => days.includes(session.date))
        .reduce((sum, session) => sum + session.exercises.length, 0),
      sets: summaries.reduce((sum, day) => sum + day.sets, 0),
      volume: summaries.reduce((sum, day) => sum + day.volume, 0)
    }
  };
}

export function demoGetProfile() {
  return { profile: getState().profile };
}

export function demoUpdateProfile(payload: {
  displayName: string;
  fitnessGoal: FitnessGoal;
  dailyCalorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  currentWeight?: number;
}) {
  const state = getState();
  state.profile = {
    ...state.profile,
    displayName: payload.displayName,
    fitnessGoal: payload.fitnessGoal,
    dailyCalorieTarget: payload.dailyCalorieTarget,
    proteinTarget: payload.proteinTarget,
    carbsTarget: payload.carbsTarget,
    fatsTarget: payload.fatsTarget,
    currentWeight: payload.currentWeight ?? null
  };
  setState(state);
  return { profile: state.profile };
}

export function demoGetWorkoutSessions(params?: { date?: string; limit?: number }) {
  let sessions = [...getState().workoutSessions].sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`));
  if (params?.date) {
    sessions = sessions.filter((session) => session.date === params.date);
  }
  if (params?.limit) {
    sessions = sessions.slice(0, params.limit);
  }
  return { sessions };
}

export function demoCreateWorkoutSession(payload: WorkoutSessionInput) {
  const state = getState();
  const workoutMap = new Map(state.workouts.map((workout) => [workout.id, workout]));
  const session: WorkoutSession = {
    id: state.nextIds.workoutSession++,
    title: payload.title,
    date: payload.date,
    notes: payload.notes ?? null,
    durationMinutes: payload.durationMinutes ?? null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    exercises: payload.exercises.map((exercise, index) => ({
      id: state.nextIds.sessionExercise++,
      notes: exercise.notes ?? null,
      sortOrder: index,
      workout: workoutMap.get(exercise.workoutId)!,
      sets: exercise.sets.map((set, setIndex) => ({
        id: state.nextIds.workoutSet++,
        setNumber: setIndex + 1,
        reps: set.reps,
        weight: set.weight ?? null
      }))
    }))
  };
  state.workoutSessions.push(session);
  setState(state);
  return { session };
}

export function demoDeleteWorkoutSession(id: number) {
  const state = getState();
  state.workoutSessions = state.workoutSessions.filter((session) => session.id !== id);
  setState(state);
  return { message: 'Workout session deleted' };
}

export function demoGetDashboard(date = todayISO()): DashboardResponse {
  const state = getState();
  const daily = demoGetDailyAnalytics(date);
  const weeklyStart = addDaysISO(date, -6);
  const weeklyNutrition = demoGetWeeklyAnalytics(weeklyStart);
  const weeklyWorkouts = demoGetWorkoutAnalytics(weeklyStart);
  const mealTypes: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS'];

  const todayMeals = mealTypes.map((mealType) => {
    const entries = state.meals.filter((meal) => meal.date === date && meal.mealType === mealType);
    return {
      mealType,
      itemCount: entries.reduce((sum, entry) => sum + entry.items.length, 0),
      calories: entries.reduce(
        (sum, entry) => sum + entry.items.reduce((itemSum, item) => itemSum + item.calories, 0),
        0
      )
    };
  });

  const workoutDates = new Set(state.workoutSessions.map((session) => session.date));
  let streak = 0;
  let cursor = date;
  while (workoutDates.has(cursor)) {
    streak += 1;
    cursor = addDaysISO(cursor, -1);
  }

  return {
    date,
    user: {
      id: state.profile.id,
      username: state.profile.username,
      displayName: state.profile.displayName,
      fitnessGoal: state.profile.fitnessGoal,
      dailyCalorieTarget: state.profile.dailyCalorieTarget,
      proteinTarget: state.profile.proteinTarget,
      carbsTarget: state.profile.carbsTarget,
      fatsTarget: state.profile.fatsTarget,
      currentWeight: state.profile.currentWeight
    },
    overview: {
      caloriesLogged: daily.totals.calories,
      calorieTarget: state.profile.dailyCalorieTarget,
      remainingCalories: state.profile.dailyCalorieTarget - daily.totals.calories,
      mealsLogged: todayMeals.reduce((sum, meal) => sum + meal.itemCount, 0),
      workoutsThisWeek: weeklyWorkouts.totals.sessions,
      completedSetsThisWeek: weeklyWorkouts.totals.sets,
      exerciseLibraryCount: state.workouts.length,
      workoutStreak: streak
    },
    todayMeals,
    weeklyCalories: weeklyNutrition.days.map((day) => ({ date: day.date, calories: day.calories })),
    weeklyWorkouts: weeklyWorkouts.days.map((day) => ({ date: day.date, sessions: day.sessions, volume: day.volume })),
    recentSessions: [...state.workoutSessions]
      .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))
      .slice(0, 4)
  };
}
