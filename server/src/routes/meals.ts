import { Router } from 'express';
import { prisma } from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';
import {
  createMealSchema,
  mealDateQuerySchema,
  mealIdParamSchema,
  updateMealSchema
} from '../validators/meals';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = createMealSchema.parse(req.body);
    const userId = req.user!.id;

    const meal = await prisma.mealEntry.create({
      data: {
        userId,
        date: payload.date,
        mealType: payload.mealType,
        items: {
          create: payload.items
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json({ meal });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { date } = mealDateQuerySchema.parse(req.query);
    const userId = req.user!.id;

    const meals = await prisma.mealEntry.findMany({
      where: { userId, date },
      include: { items: true },
      orderBy: [{ mealType: 'asc' }, { createdAt: 'desc' }]
    });

    res.json({ meals });
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = mealIdParamSchema.parse(req.params);
    const payload = updateMealSchema.parse(req.body);
    const userId = req.user!.id;

    const existing = await prisma.mealEntry.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new HttpError(404, 'Meal entry not found');
    }

    const meal = await prisma.mealEntry.update({
      where: { id },
      data: {
        date: payload.date,
        mealType: payload.mealType,
        items: {
          deleteMany: {},
          create: payload.items
        }
      },
      include: {
        items: true
      }
    });

    res.json({ meal });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = mealIdParamSchema.parse(req.params);
    const userId = req.user!.id;

    const existing = await prisma.mealEntry.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new HttpError(404, 'Meal entry not found');
    }

    await prisma.mealEntry.delete({
      where: { id }
    });

    res.json({ message: 'Meal entry deleted' });
  })
);

export default router;