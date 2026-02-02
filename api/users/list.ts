import type { Response } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../../src/middleware/auth.js';
import { listUsersQuerySchema } from './schemas.js';
import { listUsers } from './service.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: AuthRequest, res: Response) {
  const { success, validationError, internalError, error } = ApiResponder;

  if (req.method !== 'GET') {
    return error(res, {
      status: 405,
      message: 'Method not allowed',
    });
  }

  try {
    const query = listUsersQuerySchema.parse(req.query);

    const { users, pagination } = await listUsers(query);

    return success(res, {
      message: 'Users retrieved successfully',
      data: users,
      meta: {
        pagination,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(res, {
        message: 'Invalid query parameters',
        errors: formatZodErrors(error),
      });
    }

    return internalError(res, { error });
  }
}
