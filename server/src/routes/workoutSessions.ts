import { Router } from 'express';
import { prisma } from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';
import {
  createWorkoutSessionSchema,
  workoutSessionIdParamSchema,
  workoutSessionQuerySchema
} from '../validators/workoutSessions';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { date, limit } = workoutSessionQuerySchema.parse(req.query);
    const userId = req.user!.id;

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        ...(date ? { date } : {})
      },
      take: limit,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      include: {
        exercises: {
          orderBy: { sortOrder: 'asc' },
          include: {
            workout: true,
            sets: {
              orderBy: { setNumber: 'asc' }
            }
          }
        }
      }
    });

    res.json({ sessions });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = createWorkoutSessionSchema.parse(req.body);
    const userId = req.user!.id;

    const workoutIds = Array.from(
      new Set(payload.exercises.map((exercise) => exercise.workoutId))
    );

    const workouts = await prisma.workout.findMany({
      where: { id: { in: workoutIds } },
      select: { id: true }
    });

    if (workouts.length !== workoutIds.length) {
      throw new HttpError(400, 'One or more selected exercises could not be found');
    }

    const session = await prisma.workoutSession.create({
      data: {
        userId,
        title: payload.title,
        date: payload.date,
        notes: payload.notes,
        durationMinutes: payload.durationMinutes,
        exercises: {
          create: payload.exercises.map((exercise, index) => ({
            workoutId: exercise.workoutId,
            notes: exercise.notes,
            sortOrder: index,
            sets: {
              create: exercise.sets.map((set, setIndex) => ({
                setNumber: setIndex + 1,
                reps: set.reps,
                weight: set.weight
              }))
            }
          }))
        }
      },
      include: {
        exercises: {
          orderBy: { sortOrder: 'asc' },
          include: {
            workout: true,
            sets: {
              orderBy: { setNumber: 'asc' }
            }
          }
        }
      }
    });

    res.status(201).json({ session });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = workoutSessionIdParamSchema.parse(req.params);
    const userId = req.user!.id;

    const existing = await prisma.workoutSession.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new HttpError(404, 'Workout session not found');
    }

    await prisma.workoutSession.delete({
      where: { id }
    });

    res.json({ message: 'Workout session deleted' });
  })
);

export default router;
