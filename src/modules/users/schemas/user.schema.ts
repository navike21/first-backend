import { z } from 'zod';
import { USER_GENDER_ARRAY } from '@Constants/userGender';

const AddressSchema = z.object({
	street: z.string().max(255).optional(),
	city: z.string().max(100).optional(),
	state: z.string().max(100).optional(),
	country: z.string().max(100).optional(),
	postalCode: z.string().max(20).optional(),
});

export const CreateUserSchema = z.object({
	email: z.email('Invalid email address').toLowerCase(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/\d/, 'Password must contain at least one number'),
	firstName: z.string().min(2).max(50).trim(),
	lastName: z.string().min(2).max(100).trim(),
	dateOfBirth: z.iso.date('Invalid date format (YYYY-MM-DD)').optional(),
	gender: z.enum(USER_GENDER_ARRAY).optional(),
	phone: z.string().max(30).optional(),
	profilePictureUrl: z.url().max(500).optional(),
	address: AddressSchema.optional(),
	groupId: z.string().optional(),
	status: z.enum(['active', 'inactive']).default('active'),
});

export const UpdateUserSchema = CreateUserSchema.omit({
	email: true,
	password: true,
}).partial();

export const UpdateMyProfileSchema = z.object({
	firstName: z.string().min(2).max(50).trim().optional(),
	lastName: z.string().min(2).max(100).trim().optional(),
	dateOfBirth: z.iso.date('Invalid date format (YYYY-MM-DD)').optional(),
	gender: z.enum(USER_GENDER_ARRAY).optional(),
	phone: z.string().max(30).optional(),
	profilePictureUrl: z.url().max(500).optional(),
	address: AddressSchema.optional(),
});

export const ListUsersQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	status: z.enum(['active', 'inactive']).optional(),
	search: z.string().optional(),
	groupId: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateMyProfileInput = z.infer<typeof UpdateMyProfileSchema>;
export type ListUsersQuery = z.infer<typeof ListUsersQuerySchema>;
