export const AUTH_ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  // Token errors
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  TOKEN_NOT_PROVIDED: 'TOKEN_NOT_PROVIDED',
  MALFORMED_TOKEN: 'MALFORMED_TOKEN',

  // Registration errors
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_EMAIL: 'INVALID_EMAIL',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',
  // Session errors
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  INVALID_SESSION: 'INVALID_SESSION',

  // Permission errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  FORBIDDEN_RESOURCE: 'FORBIDDEN_RESOURCE',

  // Password reset errors
  INVALID_RESET_TOKEN: 'INVALID_RESET_TOKEN',
  RESET_TOKEN_EXPIRED: 'RESET_TOKEN_EXPIRED',
  PASSWORD_RESET_FAILED: 'PASSWORD_RESET_FAILED',

  // Two-factor authentication errors
  INVALID_2FA_CODE: 'INVALID_2FA_CODE',
  TWO_FA_REQUIRED: 'TWO_FA_REQUIRED',
  TWO_FA_SETUP_FAILED: 'TWO_FA_SETUP_FAILED',

  // General errors
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  INTERNAL_AUTH_ERROR: 'INTERNAL_AUTH_ERROR',

  // Schema validation errors
  AUTH_SCHEMA_VALIDATION_FAILED: 'AUTH_SCHEMA_VALIDATION_FAILED',
  AUTH_SCHEMA_MIN_LENGTH_VIOLATION: 'AUTH_SCHEMA_MIN_LENGTH_VIOLATION',
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * Mensajes descriptivos para códigos de validación
 * Se utilizan en formatZodErrors para mapear códigos a mensajes legibles
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Email messages
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',

  // Password messages
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_NUMBER: 'Password must contain at least one number',
  PASSWORD_SPECIAL_CHAR:
    'Password must contain at least one special character (!@#$%^&*(),.?":{}<>|)',

  // Name messages
  NAME_REQUIRED: 'Name is required',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters',

  // Token messages
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
} as const;

/**
 * Mensajes de validación de schema para formularios
 */
export const AUTH_VALIDATION_MESSAGES = {
  // Email messages
  EMAIL_REQUIRED: 'EMAIL_REQUIRED',
  EMAIL_INVALID: 'EMAIL_INVALID',

  // Password messages
  PASSWORD_REQUIRED: 'PASSWORD_REQUIRED',
  PASSWORD_MIN_LENGTH: 'PASSWORD_MIN_LENGTH',
  PASSWORD_UPPERCASE: 'PASSWORD_UPPERCASE',
  PASSWORD_LOWERCASE: 'PASSWORD_LOWERCASE',
  PASSWORD_NUMBER: 'PASSWORD_NUMBER',
  PASSWORD_SPECIAL_CHAR: 'PASSWORD_SPECIAL_CHAR',

  // Name messages
  NAME_REQUIRED: 'NAME_REQUIRED',
  NAME_MIN_LENGTH: 'NAME_MIN_LENGTH',

  // Token messages
  REFRESH_TOKEN_REQUIRED: 'REFRESH_TOKEN_REQUIRED',
} as const;

export type AuthValidationMessage =
  (typeof AUTH_VALIDATION_MESSAGES)[keyof typeof AUTH_VALIDATION_MESSAGES];

export const AUTH_SUCCESS_CODES = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  REGISTRATION_SUCCESS: 'REGISTRATION_SUCCESS',
  TOKEN_REFRESH_SUCCESS: 'TOKEN_REFRESH_SUCCESS',
  USER_PROFILE_RETRIEVED: 'USER_PROFILE_RETRIEVED',
} as const;

export type AuthSuccessCode =
  (typeof AUTH_SUCCESS_CODES)[keyof typeof AUTH_SUCCESS_CODES];

export const AUTH_SUCCESS_MESSAGES: Record<string, string> = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  TOKEN_REFRESH_SUCCESS: 'Tokens refreshed successfully',
  USER_PROFILE_RETRIEVED: 'User profile retrieved successfully',
} as const;

export type AuthSuccessMessage =
  (typeof AUTH_SUCCESS_MESSAGES)[keyof typeof AUTH_SUCCESS_MESSAGES];
