import type { Response } from 'express';
import type { AuthRequest } from '../../../src/middleware/auth.js';
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
      errors: [{ field: 'id', issue: 'User ID is required', code: 'REQUIRED' }],
    });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return notFound(res, { resource: 'User' });
    }

    return success(res, {
      message: 'User retrieved successfully',
      data: { user },
    });
  } catch (error) {
    return ApiResponder.internalError(res, { error });
  }
}
