import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpError } from './httpError';

type TokenPayload = {
  id: number;
  username: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new HttpError(500, 'JWT_SECRET is not configured');
  }
  return secret;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded === 'string') {
    throw new HttpError(401, 'Invalid token payload');
  }

  const payload = decoded as JwtPayload;
  if (typeof payload.id !== 'number' || typeof payload.username !== 'string') {
    throw new HttpError(401, 'Invalid token payload');
  }

  return {
    id: payload.id,
    username: payload.username
  };
}