import { MuscleGroup } from '@prisma/client';
import { HttpError } from './httpError';

const muscleLookup: Record<string, MuscleGroup> = {
  chest: MuscleGroup.CHEST,
  back: MuscleGroup.BACK,
  legs: MuscleGroup.LEGS,
  shoulders: MuscleGroup.SHOULDERS,
  arms: MuscleGroup.ARMS,
  core: MuscleGroup.CORE
};

function normalizeMuscleKey(value: string): string {
  return value.toLowerCase().replace(/[\s_-]+/g, '');
}

export function parseMusclesParam(raw?: string): MuscleGroup[] {
  if (!raw) {
    return [];
  }

  const muscles = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      const normalized = normalizeMuscleKey(value);
      const muscle = muscleLookup[normalized];
      if (!muscle) {
        throw new HttpError(400, `Invalid muscle group: ${value}`);
      }
      return muscle;
    });

  return Array.from(new Set(muscles));
}