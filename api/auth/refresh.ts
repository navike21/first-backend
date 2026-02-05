import type { Request, Response } from 'express';
import { refreshTokenSchema } from './schemas.js';
import { AUTH_ERROR_CODES, AUTH_SUCCESS_CODES } from './constants.js';
import supabase from '../../src/lib/supabase.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: Request, res: Response) {
  const { unauthorized, success, validationError } = ApiResponder;

  try {
    // Validate input
    const validatedData = refreshTokenSchema.parse(req.body);

    // Refresh session with Supabase using refresh token
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: validatedData.refreshToken,
    });

    if (error || !data.session || !data.user) {
      return unauthorized(res, {
        message: 'Invalid or expired refresh token',
        code: AUTH_ERROR_CODES.INVALID_TOKEN,
      });
    }

    // Success response with new tokens (role is in user_metadata)
    return success(res, {
      data: {
        tokens: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
      message: 'Tokens refreshed successfully',
      code: AUTH_SUCCESS_CODES.TOKEN_REFRESH_SUCCESS,
    });
  } catch (error) {
    console.error('Refresh token error:', error);

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return validationError(res, {
        errors: formatZodErrors(error),
        message: 'Validation error',
        code: AUTH_ERROR_CODES.INVALID_TOKEN,
      });
    }

    // Fallback: invalid or expired token
    return unauthorized(res, {
      message: 'Invalid or expired refresh token',
    });
  }
}
