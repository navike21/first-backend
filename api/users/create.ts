import type { Response } from 'express';
import { ZodError } from 'zod';
import { type AuthRequest } from '../../src/middleware/auth.js';
import { createUserSchema } from './schemas.js';
import { createUser, isEmailTaken } from './service.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: AuthRequest, res: Response) {
  const { validationError, internalError, error, conflict, created } =
    ApiResponder;

  if (req.method !== 'POST') {
    return error(res, {
      status: 405,
      message: 'Method not allowed',
    });
  }

  try {
    // Validate input
    const validatedData = createUserSchema.parse(req.body);

    // Check if email is already taken
    const emailExists = await isEmailTaken(validatedData.email);
    if (emailExists) {
      return conflict(res, {
        message: 'Email already in use',
        errors: [
          {
            field: 'email',
            issue: 'This email is already registered',
            code: 'EMAIL_EXISTS',
          },
        ],
      });
    }

    // Create user
    const user = await createUser(validatedData);

    return created(res, {
      message: 'User created successfully',
      data: { user },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(res, {
        message: 'Validation failed',
        errors: formatZodErrors(error),
      });
    }

    return internalError(res, { error });
  }
}
