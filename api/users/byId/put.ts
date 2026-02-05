import type { Response } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../../../src/middleware/auth.js';
import { USER_ERROR_CODES, USER_SUCCESS_CODES } from '../constants.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../../src/utils/response-handler.js';
import { getUserById, isEmailTaken, updateUser } from '../service.js';
import { updateUserSchema } from '../schemas.js';

export async function handleUpdateUser(
  req: AuthRequest,
  res: Response
): Promise<void | Response> {
  const userId = req.params.id as string;
  const { validationError, conflict, notFound, success, internalError } =
    ApiResponder;

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
    const validatedData = updateUserSchema.parse(req.body);

    // Check if user exists
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return notFound(res, {
        resource: 'User',
        code: USER_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Check if email is being changed and if it's already taken
    if (validatedData.email) {
      const emailTaken = await isEmailTaken(validatedData.email, userId);
      if (emailTaken) {
        return conflict(res, {
          message: 'Email already in use',
          errors: [
            {
              field: 'email',
              code: USER_ERROR_CODES.DUPLICATE_EMAIL,
              message: 'This email is already registered',
            },
          ],
          code: USER_ERROR_CODES.DUPLICATE_EMAIL,
        });
      }
    }

    const updatedUser = await updateUser(userId, validatedData);

    return success(res, {
      message: 'User updated successfully',
      data: { user: updatedUser },
      code: USER_SUCCESS_CODES.USER_UPDATED,
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
