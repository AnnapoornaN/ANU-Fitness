import { FitnessGoal } from '@prisma/client';
import { z } from 'zod';

const cleanedString = (label: string, min: number, max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : value),
    z.string().min(min, `${label} must be at least ${min} characters`).max(max, `${label} must be at most ${max} characters`)
  );

const intRange = (label: string, min: number, max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() !== '' ? Number(value) : value),
    z
      .number()
      .int(`${label} must be a whole number`)
      .min(min, `${label} must be at least ${min}`)
      .max(max, `${label} must be at most ${max}`)
  );

const optionalNumber = z.preprocess(
  (value) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value === 'string') {
      return Number(value);
    }

    return value;
  },
  z.number().positive('Body weight must be greater than 0').max(500, 'Body weight looks too high').optional()
);

const goalSchema = z.preprocess(
  (value) =>
    typeof value === 'string'
      ? value.trim().toUpperCase().replace(/\s+/g, '_')
      : value,
  z.nativeEnum(FitnessGoal)
);

export const updateProfileSchema = z.object({
  displayName: cleanedString('Display name', 2, 40),
  fitnessGoal: goalSchema,
  dailyCalorieTarget: intRange('Calorie target', 1200, 5000),
  proteinTarget: intRange('Protein target', 0, 350),
  carbsTarget: intRange('Carb target', 0, 600),
  fatsTarget: intRange('Fat target', 0, 250),
  currentWeight: optionalNumber
});
