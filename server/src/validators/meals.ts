import { MealType } from '@prisma/client';
import { z } from 'zod';
import { isValidISODate } from '../utils/dates';

const isoDateSchema = z
  .string()
  .refine(isValidISODate, 'Date must be a valid YYYY-MM-DD');

const mealTypeSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.toUpperCase() : value),
  z.nativeEnum(MealType)
);

const requiredNumber = z.preprocess((value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return value;
}, z.number().nonnegative('Value cannot be negative'));

const optionalNumber = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return value;
}, z.number().nonnegative('Value cannot be negative').optional());

const mealItemSchema = z.object({
  name: z.string().trim().min(1, 'Food name is required'),
  quantity: z.string().trim().min(1, 'Quantity is required'),
  calories: requiredNumber,
  protein: optionalNumber,
  carbs: optionalNumber,
  fats: optionalNumber
});

export const createMealSchema = z.object({
  date: isoDateSchema,
  mealType: mealTypeSchema,
  items: z.array(mealItemSchema).min(1, 'At least one item is required')
});

export const updateMealSchema = createMealSchema;

export const mealDateQuerySchema = z.object({
  date: isoDateSchema
});

export const mealIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});