import type { Response } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../../src/middleware/auth.js';
import { updateUserRoleSchema, type Role } from './schemas.js';
import { USER_ERROR_CODES, USER_SUCCESS_CODES } from './constants.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';
import { getUserById, updateUserRole } from './service.js';
export default async function handler(req: AuthRequest, res: Response) {
  const { success, validationError, internalError, notFound, forbidden } =
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
    const validatedData = updateUserRoleSchema.parse(req.body);

    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
      return notFound(res, {
        resource: 'User',
        code: USER_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Prevent users from changing their own role
    if (userId === req.user?.userId) {
      return forbidden(res, {
        message: 'You cannot change your own role',
        code: USER_ERROR_CODES.USER_FORBIDDEN,
      });
    }

    // Update role
    const updatedUser = await updateUserRole(
      userId,
      validatedData.role as Role
    );

    return success(res, {
      message: 'User role updated successfully',
      data: { user: updatedUser },
      code: USER_SUCCESS_CODES.USER_ROLE_UPDATED,
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
