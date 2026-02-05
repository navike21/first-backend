import type { Response } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../../src/middleware/auth.js';
import { USER_ERROR_CODES, USER_SUCCESS_CODES } from './constants.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';
import { toggleUserStatusSchema } from './schemas.js';
import { getUserById, toggleUserStatus } from './service.js';

export default async function handler(req: AuthRequest, res: Response) {
  const { validationError, internalError, notFound, forbidden, success } =
    ApiResponder;

  const userId = req.query.id as string;

  if (!userId) {
    return validationError(res, {
      message: 'User ID is required',
      errors: [
        {
          field: 'id',
          code: USER_ERROR_CODES.INVALID_USER_ID,
          message: 'User ID is required',
        },
      ],
      code: USER_ERROR_CODES.INVALID_USER_ID,
    });
  }

  try {
    // Validate input
    const validatedData = toggleUserStatusSchema.parse(req.body);

    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
      return notFound(res, {
        resource: 'User',
        code: USER_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Prevent users from deactivating themselves
    if (userId === req.user?.userId) {
      return forbidden(res, {
        message: 'You cannot change your own status',
        code: USER_ERROR_CODES.USER_FORBIDDEN,
      });
    }

    // Toggle status
    const updatedUser = await toggleUserStatus(userId, validatedData.isActive);

    return success(res, {
      message: `User ${validatedData.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user: updatedUser },
      code: USER_SUCCESS_CODES.USER_STATUS_UPDATED,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(res, {
        message: 'Validation failed',
        errors: formatZodErrors(error),
        code: USER_ERROR_CODES.INVALID_USER_DATA,
      });
    }

    return internalError(res, { error });
  }
}
