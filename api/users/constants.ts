export const USER_ERROR_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_USER_DATA: 'INVALID_USER_DATA',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  USER_UNAUTHORIZED: 'USER_UNAUTHORIZED',
  USER_FORBIDDEN: 'USER_FORBIDDEN',
  INVALID_USER_ID: 'INVALID_USER_ID',
  USER_UPDATE_FAILED: 'USER_UPDATE_FAILED',
  USER_DELETE_FAILED: 'USER_DELETE_FAILED',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
  PASSWORD_RESET_REQUIRED: 'PASSWORD_RESET_REQUIRED',
} as const;

export type UserErrorCode =
  (typeof USER_ERROR_CODES)[keyof typeof USER_ERROR_CODES];

/**
 * Mensajes descriptivos para códigos de validación
 * Se utilizan en formatZodErrors para mapear códigos a mensajes legibles
 */
export const USER_ERROR_MESSAGES: Record<string, string> = {
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

  // Role messages
  ROLE_REQUIRED: 'Role is required',
  ROLE_INVALID: 'Role must be USER, ADMIN, or SUPER_ADMIN',

  // Status messages
  STATUS_REQUIRED: 'Status is required',
  STATUS_INVALID: 'Status must be a boolean',

  // Pagination messages
  PAGE_INVALID: 'Page must be a positive number',
  PER_PAGE_INVALID: 'Per page must be a positive number',
  PER_PAGE_MAX: 'Per page cannot exceed 100',
} as const;

/**
 * Mensajes de validación de schema para gestión de usuarios
 */
export const USER_VALIDATION_MESSAGES = {
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

  // Role messages
  ROLE_REQUIRED: 'ROLE_REQUIRED',
  ROLE_INVALID: 'ROLE_INVALID',

  // Status messages
  STATUS_REQUIRED: 'STATUS_REQUIRED',
  STATUS_INVALID: 'STATUS_INVALID',

  // Pagination messages
  PAGE_INVALID: 'PAGE_INVALID',
  PER_PAGE_INVALID: 'PER_PAGE_INVALID',
  PER_PAGE_MAX: 'PER_PAGE_MAX',
} as const;

export type UserValidationMessage =
  (typeof USER_VALIDATION_MESSAGES)[keyof typeof USER_VALIDATION_MESSAGES];

export const USER_SUCCESS_CODES = {
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  USER_RETRIEVED: 'USER_RETRIEVED',
  USERS_LISTED: 'USERS_LISTED',
  USER_ROLE_UPDATED: 'USER_ROLE_UPDATED',
  USER_STATUS_UPDATED: 'USER_STATUS_UPDATED',
} as const;

export type UserSuccessCode =
  (typeof USER_SUCCESS_CODES)[keyof typeof USER_SUCCESS_CODES];

export const USER_SUCCESS_MESSAGES: Record<string, string> = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_RETRIEVED: 'User retrieved successfully',
  USERS_LISTED: 'Users listed successfully',
  USER_ROLE_UPDATED: 'User role updated successfully',
  USER_STATUS_UPDATED: 'User status updated successfully',
} as const;

export type UserSuccessMessage =
  (typeof USER_SUCCESS_MESSAGES)[keyof typeof USER_SUCCESS_MESSAGES];
