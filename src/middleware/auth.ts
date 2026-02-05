import type { Request, Response, NextFunction } from 'express';
import supabase from '../lib/supabase.js';
import { ApiResponder } from '../utils/response-handler.js';

/**
 * User role types - aligned with database roles
 */
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

/**
 * Valid role values for runtime checking
 */
const VALID_ROLES: readonly UserRole[] = ['USER', 'ADMIN', 'SUPER_ADMIN'];

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

const { unauthorized, forbidden } = ApiResponder;

/**
 * Validates if a string is a valid UserRole
 */
function isValidRole(role: unknown): role is UserRole {
  return typeof role === 'string' && VALID_ROLES.includes(role as UserRole);
}

/**
 * Middleware to verify JWT token using Supabase Auth
 */
export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    // Defensive check: ensure authorization header exists and has correct format
    if (!authHeader || typeof authHeader !== 'string') {
      unauthorized(res, { message: 'No token provided' });
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      unauthorized(res, { message: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);

    // Defensive check: ensure token is not empty
    if (!token || token.trim().length === 0) {
      unauthorized(res, { message: 'No token provided' });
      return;
    }

    // Verify token with Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);

    // Defensive check: ensure valid response from Supabase
    if (error || !data || !data.user) {
      console.error('Supabase authentication error:', error);
      unauthorized(res, { message: 'Invalid or expired token' });
      return;
    }

    // Defensive check: ensure user has required properties
    if (!data.user.id || !data.user.email) {
      console.error('Invalid user data from Supabase:', data.user);
      unauthorized(res, { message: 'Invalid or expired token' });
      return;
    }

    // Extract and validate role from user_metadata, default to 'USER'
    const roleFromMetadata = data.user.user_metadata?.role;
    const role: UserRole = isValidRole(roleFromMetadata)
      ? roleFromMetadata
      : 'USER';

    // Set authenticated user in request
    req.user = {
      userId: data.user.id,
      email: data.user.email,
      role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    unauthorized(res, { message: 'Invalid or expired token' });
  }
}

/**
 * Middleware to check if user has required role
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Defensive check: ensure user is authenticated
    if (!req.user) {
      unauthorized(res, { message: 'User not authenticated' });
      return;
    }

    // Defensive check: ensure user has valid role property
    if (!req.user.role || !isValidRole(req.user.role)) {
      console.error('Invalid user role:', req.user.role);
      forbidden(res, { message: 'Insufficient permissions' });
      return;
    }

    // Defensive check: ensure allowedRoles is not empty
    if (!allowedRoles || allowedRoles.length === 0) {
      console.error('No roles specified for authorization');
      forbidden(res, { message: 'Insufficient permissions' });
      return;
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      forbidden(res, { message: 'Insufficient permissions' });
      return;
    }

    next();
  };
}
