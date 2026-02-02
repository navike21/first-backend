import type { Response } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../../src/middleware/auth.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';
import { updateUserRoleSchema } from './schemas.js';
import { getUserById, updateUserRole } from './service.js';

export default async function handler(req: AuthRequest, res: Response) {
  const {
    success,
    validationError,
    internalError,
    notFound,
    forbidden,
    error,
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
    const validatedData = updateUserRoleSchema.parse(req.body);

    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
      return notFound(res, { resource: 'User' });
    }

    // Prevent users from changing their own role
    if (userId === req.user?.userId) {
      return forbidden(res, {
        message: 'You cannot change your own role',
      });
    }

    // Update role
    const updatedUser = await updateUserRole(userId, validatedData.role);

    return success(res, {
      message: 'User role updated successfully',
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
