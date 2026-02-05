import type { Request, Response } from 'express';
import { registerSchema } from './schemas.js';
import { AUTH_ERROR_CODES, AUTH_SUCCESS_CODES } from './constants.js';
import supabase from '../../src/lib/supabase.js';
import {
  ApiResponder,
  formatZodErrors,
} from '../../src/utils/response-handler.js';

export default async function handler(req: Request, res: Response) {
  const { notFound, created, validationError, internalError } = ApiResponder;

  try {
    // Validate input
    const { email, password } = registerSchema.parse(req.body);

    // Check if user exists in Supabase
    const { data: existingUser, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !existingUser) {
      return notFound(res, {
        message: 'User not found. Please create a user account first.',
        code: AUTH_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    // Sign up with Supabase Auth - role stored in user_metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          userId: existingUser.id,
          role: 'USER',
          name: existingUser.name,
          lastName: existingUser.lastName,
        },
      },
    });

    if (error || !data.user) {
      console.error('Supabase signup error:', error);
      return internalError(res, {
        error: error?.message || 'Failed to create authentication',
        message: 'Authentication registration failed',
      });
    }

    // Respond
    return created(res, {
      data: {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          lastName: existingUser.lastName,
        },
        tokens: {
          access_token: data.session?.access_token || null,
          refresh_token: data.session?.refresh_token || null,
        },
      },
      message: 'Authentication registered successfully',
      code: AUTH_SUCCESS_CODES.REGISTRATION_SUCCESS,
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return validationError(res, {
        errors: formatZodErrors(error),
        message: 'Registration failed due to validation errors',
        code: AUTH_ERROR_CODES.REGISTRATION_FAILED,
      });
    }

    return internalError(res, { error });
  }
}
