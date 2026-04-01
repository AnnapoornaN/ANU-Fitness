import { Router } from 'express';
import { prisma } from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { parseMusclesParam } from '../utils/enums';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const musclesParam = Array.isArray(req.query.muscles)
      ? req.query.muscles.join(',')
      : typeof req.query.muscles === 'string'
      ? req.query.muscles
      : undefined;

    const muscles = parseMusclesParam(musclesParam);

    const workouts = await prisma.workout.findMany({
      where: muscles.length ? { targetMuscle: { in: muscles } } : undefined,
      orderBy: [{ targetMuscle: 'asc' }, { name: 'asc' }]
    });

    res.json({ workouts });
  })
);

export default router;