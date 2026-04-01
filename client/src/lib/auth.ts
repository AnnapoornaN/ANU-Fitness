import { FitnessGoal, User } from '../types';

const TOKEN_KEY = 'anu_fitness_token';
const USER_KEY = 'anu_fitness_user';
const DEMO_MODE_KEY = 'anu_fitness_demo_mode';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<User>;
    const fitnessGoal: FitnessGoal =
      parsed.fitnessGoal === 'FAT_LOSS' ||
      parsed.fitnessGoal === 'MAINTENANCE' ||
      parsed.fitnessGoal === 'MUSCLE_GAIN'
        ? parsed.fitnessGoal
        : 'MAINTENANCE';

    if (typeof parsed.id !== 'number' || typeof parsed.username !== 'string') {
      return null;
    }

    return {
      id: parsed.id,
      username: parsed.username,
      displayName: typeof parsed.displayName === 'string' ? parsed.displayName : null,
      fitnessGoal
    };
  } catch {
    return null;
  }
}

export function setSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function setStoredUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function enableDemoMode() {
  localStorage.setItem(DEMO_MODE_KEY, 'true');
}

export function disableDemoMode() {
  localStorage.removeItem(DEMO_MODE_KEY);
}

export function isDemoModeEnabled(): boolean {
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  disableDemoMode();
}
