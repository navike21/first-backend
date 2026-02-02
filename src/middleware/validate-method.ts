import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';
import { ApiResponder } from '../utils/response-handler.js';

/**
 * Middleware that validates if the request uses one of the allowed HTTP methods.
 * @param allowedMethods - Array of allowed HTTP methods (GET, POST, PUT, DELETE, PATCH, etc.)
 * @returns Express middleware function
 */
export function validateMethod(...allowedMethods: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const method = req.method.toUpperCase();

    if (!allowedMethods.includes(method)) {
      return ApiResponder.error(res, {
        status: 405,
        message: `Method ${method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
      });
    }

    next();
  };
}
