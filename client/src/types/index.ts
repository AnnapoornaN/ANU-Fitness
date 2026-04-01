export type MuscleGroup = 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS';
export type FitnessGoal = 'FAT_LOSS' | 'MAINTENANCE' | 'MUSCLE_GAIN';

export interface User {
  id: number;
  username: string;
  displayName: string | null;
  fitnessGoal: FitnessGoal;
}

export interface Workout {
  id: number;
  name: string;
  targetMuscle: MuscleGroup;
  equipment: string;
  difficulty: Difficulty;
  instructions: string;
  videoLink: string | null;
  createdAt: string;
}

export interface MealItem {
  id: number;
  mealEntryId: number;
  name: string;
  quantity: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
}

export interface MealEntry {
  id: number;
  userId: number;
  date: string;
  mealType: MealType;
  createdAt: string;
  items: MealItem[];
}

export interface MealItemInput {
  name: string;
  quantity: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyAnalyticsResponse {
  date: string;
  totals: Totals;
  breakdown: Record<MealType, Totals>;
}

export interface WeeklyDaySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface WeeklyAnalyticsResponse {
  start: string;
  end: string;
  days: WeeklyDaySummary[];
  totals: Totals;
}

export interface WorkoutAnalyticsDay {
  date: string;
  sessions: number;
  sets: number;
  volume: number;
}

export interface WorkoutAnalyticsResponse {
  start: string;
  end: string;
  days: WorkoutAnalyticsDay[];
  totals: {
    sessions: number;
    exercises: number;
    sets: number;
    volume: number;
  };
}

export interface Profile {
  id: number;
  username: string;
  displayName: string | null;
  fitnessGoal: FitnessGoal;
  dailyCalorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  currentWeight: number | null;
  createdAt: string;
}

export interface WorkoutSet {
  id: number;
  setNumber: number;
  reps: number;
  weight: number | null;
}

export interface WorkoutSessionExercise {
  id: number;
  notes: string | null;
  sortOrder: number;
  workout: Workout;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: number;
  title: string;
  date: string;
  notes: string | null;
  durationMinutes: number | null;
  createdAt?: string;
  updatedAt?: string;
  exercises: WorkoutSessionExercise[];
}

export interface WorkoutSessionSetInput {
  reps: number;
  weight?: number;
}

export interface WorkoutSessionExerciseInput {
  workoutId: number;
  notes?: string;
  sets: WorkoutSessionSetInput[];
}

export interface WorkoutSessionInput {
  title: string;
  date: string;
  notes?: string;
  durationMinutes?: number;
  exercises: WorkoutSessionExerciseInput[];
}

export interface DashboardOverview {
  caloriesLogged: number;
  calorieTarget: number;
  remainingCalories: number;
  mealsLogged: number;
  workoutsThisWeek: number;
  completedSetsThisWeek: number;
  exerciseLibraryCount: number;
  workoutStreak: number;
}

export interface DashboardMealSummary {
  mealType: MealType;
  itemCount: number;
  calories: number;
}

export interface DashboardDayCalories {
  date: string;
  calories: number;
}

export interface DashboardWorkoutSummary {
  date: string;
  sessions: number;
  volume: number;
}

export interface DashboardResponse {
  date: string;
  user: Omit<Profile, 'createdAt'>;
  overview: DashboardOverview;
  todayMeals: DashboardMealSummary[];
  weeklyCalories: DashboardDayCalories[];
  weeklyWorkouts: DashboardWorkoutSummary[];
  recentSessions: WorkoutSession[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const MEAL_TYPES: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS'];

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACKS: 'Snacks'
};

export const FITNESS_GOAL_LABELS: Record<FitnessGoal, string> = {
  FAT_LOSS: 'Fat loss',
  MAINTENANCE: 'Maintenance',
  MUSCLE_GAIN: 'Muscle gain'
};

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  CHEST: 'Chest',
  BACK: 'Back',
  LEGS: 'Legs',
  SHOULDERS: 'Shoulders',
  ARMS: 'Arms',
  CORE: 'Core'
};
