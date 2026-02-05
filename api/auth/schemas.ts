import { z } from 'zod';
import { AUTH_VALIDATION_MESSAGES } from './constants.js';

export const registerSchema = z.object({
  email: z.email(AUTH_VALIDATION_MESSAGES.EMAIL_INVALID),
  password: z
    .string(AUTH_VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .min(8, AUTH_VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .regex(/[A-Z]/, AUTH_VALIDATION_MESSAGES.PASSWORD_UPPERCASE)
    .regex(/[a-z]/, AUTH_VALIDATION_MESSAGES.PASSWORD_LOWERCASE)
    .regex(/\d/, AUTH_VALIDATION_MESSAGES.PASSWORD_NUMBER)
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      AUTH_VALIDATION_MESSAGES.PASSWORD_SPECIAL_CHAR
    ),
});

export const loginSchema = z.object({
  email: z.email(AUTH_VALIDATION_MESSAGES.EMAIL_INVALID),
  password: z.string().min(1, AUTH_VALIDATION_MESSAGES.PASSWORD_REQUIRED),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGES.REFRESH_TOKEN_REQUIRED),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
