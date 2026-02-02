import type { Response } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../../../src/middleware/auth.js';
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
      errors: [{ field: 'id', issue: 'User ID is required', code: 'REQUIRED' }],
    });
  }

  try {
    const validatedData = updateUserSchema.parse(req.body);

    // Check if user exists
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return notFound(res, { resource: 'User' });
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
              issue: 'This email is already registered',
              code: 'EMAIL_EXISTS',
            },
          ],
        });
      }
    }

    const updatedUser = await updateUser(userId, validatedData);

    return success(res, {
      message: 'User updated successfully',
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
