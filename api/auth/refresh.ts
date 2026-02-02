import type { Request, Response } from 'express';
import { refreshTokenSchema } from '../../src/lib/auth/schemas.js';
import { generateTokens, verifyRefreshToken } from '../../src/lib/auth/jwt.js';
import prisma from '../../src/lib/db/prisma.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: Request, res: Response) {
  const { error, unauthorized, success, validationError } = ApiResponder;

  if (req.method !== 'POST') {
    return error(res, {
      status: 405,
      message: 'Method not allowed',
    });
  }

  try {
    // Validate input
    const validatedData = refreshTokenSchema.parse(req.body);

    // Verify refresh token
    const payload = verifyRefreshToken(validatedData.refreshToken);

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user?.isActive) {
      return unauthorized(res, {
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Success response
    return success(res, {
      data: { tokens },
      message: 'Tokens refreshed successfully',
    });
  } catch (error) {
    console.error('Refresh token error:', error);

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError(res, {
        errors: formatZodErrors(error),
        message: 'Validation error',
      });
    }

    // Fallback: invalid or expired token
    return unauthorized(res, {
      message: 'Invalid or expired refresh token',
    });
  }
}
