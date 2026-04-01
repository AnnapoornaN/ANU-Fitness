import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { prisma } from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';
import { comparePassword, hashPassword } from '../utils/password';
import { DEMO_USERNAME, ensureDemoData } from '../utils/demoUser';
import { signToken } from '../utils/jwt';
import { loginSchema, registerSchema } from '../validators/auth';

const router = Router();
const publicUserSelect = {
  id: true,
  username: true,
  displayName: true,
  fitnessGoal: true
} as const;

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const payload = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { username: payload.username }
    });

    if (existingUser) {
      throw new HttpError(409, 'Username already exists');
    }

    const passwordHash = await hashPassword(payload.password);

    const user = await prisma.user.create({
      data: {
        username: payload.username,
        displayName: payload.displayName || payload.username,
        passwordHash
      },
      select: publicUserSelect
    });

    const token = signToken({ id: user.id, username: user.username });

    res.status(201).json({ token, user });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);

    if (payload.username === DEMO_USERNAME) {
      await ensureDemoData();
    }

    const user = await prisma.user.findUnique({
      where: { username: payload.username }
    });

    if (!user) {
      throw new HttpError(401, 'Invalid username or password');
    }

    const isPasswordValid = await comparePassword(payload.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid username or password');
    }

    const token = signToken({ id: user.id, username: user.username });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        fitnessGoal: user.fitnessGoal
      }
    });
  })
);

router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: publicUserSelect
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    res.json({ user });
  })
);

export default router;
