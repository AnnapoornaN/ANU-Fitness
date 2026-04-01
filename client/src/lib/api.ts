import {
  AuthResponse,
  DashboardResponse,
  DailyAnalyticsResponse,
  Profile,
  MealEntry,
  MealItemInput,
  MealType,
  WorkoutAnalyticsResponse,
  WorkoutSession,
  WorkoutSessionInput,
  WeeklyAnalyticsResponse,
  Workout
} from '../types';
import { clearSession, getToken, isDemoModeEnabled } from './auth';
import {
  demoCreateMealEntry,
  demoCreateWorkoutSession,
  demoCurrentUser,
  demoDeleteMealEntry,
  demoDeleteWorkoutSession,
  demoGetDailyAnalytics,
  demoGetDashboard,
  demoGetHealth,
  demoGetMeals,
  demoGetProfile,
  demoGetWorkoutAnalytics,
  demoGetWorkoutSessions,
  demoGetWorkouts,
  demoGetWeeklyAnalytics,
  demoLogin,
  demoUpdateMealEntry,
  demoUpdateProfile
} from './demoApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isOfflineError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 0;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authRequired = true
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (authRequired) {
    const token = getToken();
    if (!token) {
      throw new ApiError(401, 'Not authenticated');
    }
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new ApiError(
      0,
      `Unable to reach the API server at ${API_URL}. Start the server and try again.`
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && authRequired) {
      clearSession();
    }
    throw new ApiError(response.status, data.message || 'Request failed');
  }

  return data as T;
}

export function register(payload: {
  username: string;
  password: string;
  displayName?: string;
}) {
  return request<AuthResponse>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    false
  );
}

export function login(payload: { username: string; password: string }) {
  return request<AuthResponse>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    false
  ).catch((error) => {
    if (
      isOfflineError(error) &&
      payload.username.trim() === 'demo_anu' &&
      payload.password === 'fitness123'
    ) {
      return demoLogin();
    }

    throw error;
  });
}

export function getHealth() {
  return request<{ status: string }>('/health', {}, false).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoGetHealth();
    }

    throw error;
  });
}

export function getCurrentUser() {
  return request<{ user: AuthResponse['user'] }>('/api/auth/me').catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoCurrentUser();
    }

    throw error;
  });
}

export function getDashboard(date?: string) {
  const suffix = date ? `?date=${encodeURIComponent(date)}` : '';
  return request<DashboardResponse>(`/api/dashboard${suffix}`).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoGetDashboard(date);
    }

    throw error;
  });
}

export function getWorkouts(muscles: string[]) {
  const params = new URLSearchParams();
  if (muscles.length) {
    params.set('muscles', muscles.join(','));
  }
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return request<{ workouts: Workout[] }>(`/api/workouts${suffix}`).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoGetWorkouts(muscles);
    }

    throw error;
  });
}

export function createMealEntry(payload: {
  date: string;
  mealType: MealType;
  items: MealItemInput[];
}) {
  return request<{ meal: MealEntry }>('/api/meals', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoCreateMealEntry(payload);
    }

    throw error;
  });
}

export function getMeals(date: string) {
  return request<{ meals: MealEntry[] }>(`/api/meals?date=${encodeURIComponent(date)}`).catch(
    (error) => {
      if (isOfflineError(error) && isDemoModeEnabled()) {
        return demoGetMeals(date);
      }

      throw error;
    }
  );
}

export function updateMealEntry(
  id: number,
  payload: { date: string; mealType: MealType; items: MealItemInput[] }
) {
  return request<{ meal: MealEntry }>(`/api/meals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoUpdateMealEntry(id, payload);
    }

    throw error;
  });
}

export function deleteMealEntry(id: number) {
  return request<{ message: string }>(`/api/meals/${id}`, {
    method: 'DELETE'
  }).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoDeleteMealEntry(id);
    }

    throw error;
  });
}

export function getDailyAnalytics(date: string) {
  return request<DailyAnalyticsResponse>(
    `/api/analytics/daily?date=${encodeURIComponent(date)}`
  ).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoGetDailyAnalytics(date);
    }

    throw error;
  });
}

export function getWeeklyAnalytics(start: string) {
  return request<WeeklyAnalyticsResponse>(
    `/api/analytics/weekly?start=${encodeURIComponent(start)}`
  ).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoGetWeeklyAnalytics(start);
    }

    throw error;
  });
}

export function getWorkoutAnalytics(start: string) {
  return request<WorkoutAnalyticsResponse>(
    `/api/analytics/workouts?start=${encodeURIComponent(start)}`
  ).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoGetWorkoutAnalytics(start);
    }

    throw error;
  });
}

export function getProfile() {
  return request<{ profile: Profile }>('/api/profile').catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoGetProfile();
    }

    throw error;
  });
}

export function updateProfile(payload: {
  displayName: string;
  fitnessGoal: Profile['fitnessGoal'];
  dailyCalorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  currentWeight?: number;
}) {
  return request<{ profile: Profile }>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoUpdateProfile(payload);
    }

    throw error;
  });
}

export function getWorkoutSessions(params?: { date?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.date) {
    search.set('date', params.date);
  }
  if (params?.limit) {
    search.set('limit', String(params.limit));
  }

  const suffix = search.toString() ? `?${search.toString()}` : '';
  return request<{ sessions: WorkoutSession[] }>(`/api/workout-sessions${suffix}`).catch(
    (error) => {
      if (isOfflineError(error) && isDemoModeEnabled()) {
        return demoGetWorkoutSessions(params);
      }

      throw error;
    }
  );
}

export function createWorkoutSession(payload: WorkoutSessionInput) {
  return request<{ session: WorkoutSession }>('/api/workout-sessions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoCreateWorkoutSession(payload);
    }

    throw error;
  });
}

export function deleteWorkoutSession(id: number) {
  return request<{ message: string }>(`/api/workout-sessions/${id}`, {
    method: 'DELETE'
  }).catch((error) => {
    if (isOfflineError(error) && isDemoModeEnabled()) {
      return demoDeleteWorkoutSession(id);
    }

    throw error;
  });
}
