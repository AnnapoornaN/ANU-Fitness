import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import analyticsRouter from './routes/analytics';
import authRouter from './routes/auth';
import dashboardRouter from './routes/dashboard';
import mealsRouter from './routes/meals';
import profileRouter from './routes/profile';
import workoutSessionsRouter from './routes/workoutSessions';
import workoutsRouter from './routes/workouts';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api', authMiddleware);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/profile', profileRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/workout-sessions', workoutSessionsRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/analytics', analyticsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;
