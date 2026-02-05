import type { Request, Response } from 'express';
import { loginSchema } from './schemas.js';
import { AUTH_ERROR_CODES, AUTH_SUCCESS_CODES } from './constants.js';
import supabase from '../../src/lib/supabase.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: Request, res: Response) {
  const { validationError, unauthorized, success, internalError, notFound } =
    ApiResponder;

  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error || !data.session) {
      return unauthorized(res, {
        message: 'Invalid credentials',
        code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    // Fetch user data from Supabase for additional information
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('email', validatedData.email)
      .single();

    if (userError || !userData) {
      return notFound(res, {
        message: 'User not found',
        code: AUTH_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Get role from user_metadata (already in data.user from auth)
    const role = (data.user.user_metadata?.role as string) || 'USER';

    // Success response
    return success(res, {
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          lastName: userData.lastName,
          role,
          isActive: true,
        },
        tokens: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
      message: 'Login successful',
      code: AUTH_SUCCESS_CODES.LOGIN_SUCCESS,
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return validationError(res, {
        errors: formatZodErrors(error),
        message: 'Validation error',
        code: AUTH_ERROR_CODES.INVALID_EMAIL,
      });
    }

    return internalError(res, {
      error,
      message: 'Internal server error',
    });
  }
}
