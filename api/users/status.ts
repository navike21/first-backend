import type { Response } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../../src/middleware/auth.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';
import { toggleUserStatusSchema } from './schemas.js';
import { getUserById, toggleUserStatus } from './service.js';

export default async function handler(req: AuthRequest, res: Response) {
  const {
    validationError,
    error,
    internalError,
    notFound,
    forbidden,
    success,
  } = ApiResponder;

  if (req.method !== 'PATCH') {
    return error(res, {
      status: 405,
      message: 'Method not allowed',
    });
  }

  const userId = req.query.id as string;

  if (!userId) {
    return validationError(res, {
      message: 'User ID is required',
      errors: [{ field: 'id', issue: 'User ID is required', code: 'REQUIRED' }],
    });
  }

  try {
    // Validate input
    const validatedData = toggleUserStatusSchema.parse(req.body);

    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
      return notFound(res, { resource: 'User' });
    }

    // Prevent users from deactivating themselves
    if (userId === req.user?.userId) {
      return forbidden(res, {
        message: 'You cannot change your own status',
      });
    }

    // Toggle status
    const updatedUser = await toggleUserStatus(userId, validatedData.isActive);

    return success(res, {
      message: `User ${validatedData.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user: updatedUser },
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
