import type { Response } from 'express';
import { ZodError } from 'zod';
import { type AuthRequest } from '../../src/middleware/auth.js';
import { USER_ERROR_CODES, USER_SUCCESS_CODES } from './constants.js';
import { createUserSchema } from './schemas.js';
import { createUser, isEmailTaken } from './service.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: AuthRequest, res: Response) {
  const { validationError, internalError, conflict, created } = ApiResponder;

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
            code: USER_ERROR_CODES.DUPLICATE_EMAIL,
            message: 'This email is already registered',
          },
        ],
        code: USER_ERROR_CODES.DUPLICATE_EMAIL,
      });
    }

    // Create user (only personal data, no auth)
    const user = await createUser(validatedData);

    return created(res, {
      message: 'User created successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          birth: user.birth,
          address: user.address,
          sex: user.sex,
          photoUrl: user.photoUrl,
          documentId: user.documentId,
        },
      },
      code: USER_SUCCESS_CODES.USER_CREATED,
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
