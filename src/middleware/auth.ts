import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';
import { verifyAccessToken } from '../lib/auth/jwt.js';
import { ApiResponder } from '../utils/response-handler.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

const { unauthorized, forbidden } = ApiResponder;

/**
 * Middleware to verify JWT token
 */
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      unauthorized(res, { message: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    unauthorized(res, { message: 'Invalid or expired token' });
  }
}

/**
 * Middleware to check if user has required role
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      unauthorized(res, { message: 'User not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      forbidden(res, { message: 'Insufficient permissions' });
      return;
    }

    next();
  };
}
