import type { Response } from 'express';
import type { AuthRequest } from '../../src/middleware/auth.js';
import prisma from '../../src/lib/db/prisma.js';
import { ApiResponder } from '../../src/utils/response-handler.js';

export default async function handler(req: AuthRequest, res: Response) {
  const { error, notFound, success, internalError } = ApiResponder;

  if (req.method !== 'GET') {
    return error(res, {
      status: 405,
      message: 'Method not allowed',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return notFound(res, { message: 'User not found' });
    }

    return success(res, {
      data: { user },
      message: 'User retrieved successfully',
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return internalError(res, { error });
  }
}
