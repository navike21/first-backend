import type { Request, Response } from 'express';
import { loginSchema } from '../../src/lib/auth/schemas.js';
import prisma from '../../src/lib/db/prisma.js';
import { comparePassword } from '../../src/lib/auth/password.js';
import { generateTokens } from '../../src/lib/auth/jwt.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: Request, res: Response) {
  const {
    error,
    validationError,
    unauthorized,
    forbidden,
    success,
    internalError,
  } = ApiResponder;

  if (req.method !== 'POST') {
    return error(res, {
      status: 405,
      message: 'Method not allowed',
    });
  }

  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return unauthorized(res, { message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return forbidden(res, { message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      return unauthorized(res, { message: 'Invalid credentials' });
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Success response
    return success(res, {
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
        },
        tokens,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return validationError(res, {
        errors: formatZodErrors(error),
        message: 'Validation error',
      });
    }

    return internalError(res, {
      error,
      message: 'Internal server error',
    });
  }
}
