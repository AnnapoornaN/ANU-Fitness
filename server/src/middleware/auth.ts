import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';
import { verifyToken } from '../utils/jwt';

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing or invalid Authorization header'));
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, username: payload.username };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}