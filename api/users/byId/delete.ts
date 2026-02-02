import type { Response } from 'express';
import type { AuthRequest } from '../../../src/middleware/auth.js';
import { ApiResponder } from '../../../src/utils/response-handler.js';
import { deleteUser, getUserById } from '../service.js';

export async function handleDeleteUser(
  req: AuthRequest,
  res: Response
): Promise<void | Response> {
  const userId = req.params.id as string;
  const { validationError, notFound, success, internalError } = ApiResponder;

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

    const deletedUser = await deleteUser(userId);

    return success(res, {
      message: 'User deactivated successfully',
      data: { user: deletedUser },
    });
  } catch (error) {
    return internalError(res, { error });
  }
}
