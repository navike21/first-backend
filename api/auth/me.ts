import type { Response } from 'express';
import type { AuthRequest } from '../../src/middleware/auth.js';
import { AUTH_ERROR_CODES, AUTH_SUCCESS_CODES } from './constants.js';
import supabase from '../../src/lib/supabase.js';
import { ApiResponder } from '../../src/utils/response-handler.js';

export default async function handler(req: AuthRequest, res: Response) {
  const { notFound, success, internalError } = ApiResponder;

  try {
    // Fetch user from Supabase using userId from authenticated request
    const { data: user, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', req.user?.userId)
      .single();

    if (error || !user) {
      return notFound(res, {
        message: 'User not found',
        code: AUTH_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Add role from authenticated request (already from user_metadata)
    const userWithRole = {
      ...user,
      role: req.user?.role || 'USER',
      isActive: true,
    };

    return success(res, {
      data: { user: userWithRole },
      message: 'User retrieved successfully',
      code: AUTH_SUCCESS_CODES.USER_PROFILE_RETRIEVED,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return internalError(res, { error });
  }
}
