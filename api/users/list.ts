import type { Response } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../../src/middleware/auth.js';
import { USER_ERROR_CODES, USER_SUCCESS_CODES } from './constants.js';
import { listUsersQuerySchema } from './schemas.js';
import { listUsers } from './service.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: AuthRequest, res: Response) {
  const { success, validationError, internalError } = ApiResponder;

  try {
    const query = listUsersQuerySchema.parse(req.query);

    const { users, pagination } = await listUsers(query);

    return success(res, {
      message: 'Users retrieved successfully',
      data: users,
      meta: {
        pagination,
      },
      code: USER_SUCCESS_CODES.USERS_LISTED,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(res, {
        message: 'Invalid query parameters',
        errors: formatZodErrors(error),
        code: USER_ERROR_CODES.INVALID_USER_DATA,
      });
    }

    return internalError(res, { error });
  }
}
