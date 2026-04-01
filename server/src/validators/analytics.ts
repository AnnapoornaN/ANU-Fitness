import { z } from 'zod';
import { isValidISODate } from '../utils/dates';

const isoDateSchema = z
  .string()
  .refine(isValidISODate, 'Date must be a valid YYYY-MM-DD');

export const dailyAnalyticsQuerySchema = z.object({
  date: isoDateSchema
});

export const weeklyAnalyticsQuerySchema = z.object({
  start: isoDateSchema
});