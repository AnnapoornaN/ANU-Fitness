import { z } from 'zod';
import { isValidISODate } from '../utils/dates';

const isoDateSchema = z
  .string()
  .refine(isValidISODate, 'Date must be a valid YYYY-MM-DD');

const integerField = (label: string, minimum: number, maximum: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() !== '' ? Number(value) : value),
    z
      .number()
      .int(`${label} must be a whole number`)
      .min(minimum, `${label} must be at least ${minimum}`)
      .max(maximum, `${label} must be at most ${maximum}`)
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
  z.number().nonnegative('Value cannot be negative').max(1000, 'Value looks too high').optional()
);

const optionalText = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return value;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max, `Text must be at most ${max} characters`).optional()
  );

const setSchema = z.object({
  reps: integerField('Reps', 1, 100),
  weight: optionalNumber
});

const exerciseSchema = z.object({
  workoutId: z.coerce.number().int().positive(),
  notes: optionalText(240),
  sets: z.array(setSchema).min(1, 'Each exercise needs at least one set')
});

export const createWorkoutSessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Workout title must be at least 2 characters')
    .max(80, 'Workout title must be at most 80 characters'),
  date: isoDateSchema,
  notes: optionalText(500),
  durationMinutes: integerField('Duration', 5, 300).optional(),
  exercises: z.array(exerciseSchema).min(1, 'Add at least one exercise to the workout')
});

export const workoutSessionQuerySchema = z.object({
  date: isoDateSchema.optional(),
  limit: z.coerce.number().int().positive().max(20).optional()
});

export const workoutSessionIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});
