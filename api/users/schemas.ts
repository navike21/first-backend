import { z } from 'zod';
import { USER_VALIDATION_MESSAGES } from './constants.js';

/**
 * User role types - aligned with database roles
 */
export const Role = ['USER', 'ADMIN', 'SUPER_ADMIN'] as const;
export type Role = (typeof Role)[number];

export const createUserSchema = z.object({
  email: z.email(USER_VALIDATION_MESSAGES.EMAIL_INVALID),
  name: z.string().min(2, USER_VALIDATION_MESSAGES.NAME_MIN_LENGTH),
  lastName: z
    .string()
    .min(2, USER_VALIDATION_MESSAGES.NAME_MIN_LENGTH)
    .optional(),
  birth: z.coerce.date().optional(),
  address: z.string().optional(),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  photoUrl: z.string().optional(),
  documentId: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.email(USER_VALIDATION_MESSAGES.EMAIL_INVALID).optional(),
  name: z.string().min(2, USER_VALIDATION_MESSAGES.NAME_MIN_LENGTH).optional(),
  lastName: z
    .string()
    .min(2, USER_VALIDATION_MESSAGES.NAME_MIN_LENGTH)
    .optional(),
  birth: z.coerce.date().optional(),
  address: z.string().optional(),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  photoUrl: z.string().optional(),
  documentId: z.string().optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(Role).refine((val) => Object.values(Role).includes(val), {
    message: USER_VALIDATION_MESSAGES.ROLE_INVALID,
  }),
});

export const toggleUserStatusSchema = z.object({
  isActive: z.boolean(USER_VALIDATION_MESSAGES.STATUS_INVALID),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce
    .number()
    .int(USER_VALIDATION_MESSAGES.PAGE_INVALID)
    .min(1, USER_VALIDATION_MESSAGES.PAGE_INVALID)
    .default(1),
  perPage: z.coerce
    .number()
    .int(USER_VALIDATION_MESSAGES.PER_PAGE_INVALID)
    .min(1, USER_VALIDATION_MESSAGES.PER_PAGE_INVALID)
    .max(100, USER_VALIDATION_MESSAGES.PER_PAGE_MAX)
    .default(10),
  search: z.string().optional(),
  role: z.enum(Role).optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'name', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
