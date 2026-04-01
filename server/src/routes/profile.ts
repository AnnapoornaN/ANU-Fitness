import { Router } from 'express';
import { prisma } from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';
import { updateProfileSchema } from '../validators/profile';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const profile = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        displayName: true,
        fitnessGoal: true,
        dailyCalorieTarget: true,
        proteinTarget: true,
        carbsTarget: true,
        fatsTarget: true,
        currentWeight: true,
        createdAt: true
      }
    });

    if (!profile) {
      throw new HttpError(404, 'User not found');
    }

    res.json({ profile });
  })
);

router.put(
  '/',
  asyncHandler(async (req, res) => {
    const payload = updateProfileSchema.parse(req.body);

    const profile = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        displayName: payload.displayName,
        fitnessGoal: payload.fitnessGoal,
        dailyCalorieTarget: payload.dailyCalorieTarget,
        proteinTarget: payload.proteinTarget,
        carbsTarget: payload.carbsTarget,
        fatsTarget: payload.fatsTarget,
        currentWeight: payload.currentWeight
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        fitnessGoal: true,
        dailyCalorieTarget: true,
        proteinTarget: true,
        carbsTarget: true,
        fatsTarget: true,
        currentWeight: true,
        createdAt: true
      }
    });

    res.json({ profile });
  })
);

export default router;
