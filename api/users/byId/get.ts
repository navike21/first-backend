import type { Response } from 'express';
import type { AuthRequest } from '../../../src/middleware/auth.js';
import { USER_ERROR_CODES, USER_SUCCESS_CODES } from '../constants.js';
import { ApiResponder } from '../../../src/utils/response-handler.js';
import { getUserById } from '../service.js';

export async function handleGetUser(
  req: AuthRequest,
  res: Response
): Promise<void | Response> {
  const userId = req.params.id as string;
  const { validationError, notFound, success } = ApiResponder;

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
    const user = await getUserById(userId);

    if (!user) {
      return notFound(res, {
        resource: 'User',
        code: USER_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    return success(res, {
      message: 'User retrieved successfully',
      data: { user },
      code: USER_SUCCESS_CODES.USER_RETRIEVED,
    });
  } catch (error) {
    return ApiResponder.internalError(res, { error });
  }
}
