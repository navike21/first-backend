import { z } from 'zod';
import { USER_GENDER_ARRAY } from '@Constants/userGender';

const AddressSchema = z.object({
	country: z.string().max(10).optional(),
	ubigeoCode: z.string().max(10).optional(),
	region: z.string().max(100).optional(),
	province: z.string().max(100).optional(),
	district: z.string().max(100).optional(),
	address: z.string().max(255).optional(),
	addressNumber: z.string().max(50).optional(),
	addressInterior: z.string().max(100).optional(),
});

const PasswordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/\d/, 'Password must contain at least one number');

export const CreateUserSchema = z.object({
	email: z.email('Invalid email address').toLowerCase(),
	// Optional: omit to create a passwordless user (invite flow); if provided it
	// must meet the strength rules. The user sets it later via forgot-password.
	password: PasswordSchema.optional(),
	firstName: z.string().min(2).max(50).trim(),
	lastName: z.string().min(2).max(100).trim(),
	dateOfBirth: z.iso.date('Invalid date format (YYYY-MM-DD)').optional(),
	gender: z.enum(USER_GENDER_ARRAY).optional(),
	phone: z.string().max(30).optional(),
	// Empty string clears the avatar (unset + delete files); a URL sets it.
	profilePictureUrl: z.url().max(500).or(z.literal('')).optional(),
	address: AddressSchema.optional(),
	groupIds: z.array(z.string()).optional(),
	status: z.enum(['active', 'inactive']).default('active'),
});

export const UpdateUserSchema = CreateUserSchema.omit({
	email: true,
	password: true,
})
	.partial()
	// An admin (users:update / :manage) may set a NEW password while editing the
	// user — optional, same strength rules. Email stays immutable here (separate
	// verified flow). Hashing + passwordChangedAt happen in applyUserUpdate.
	.extend({ password: PasswordSchema.optional() });

export const UpdateMyProfileSchema = z.object({
	firstName: z.string().min(2).max(50).trim().optional(),
	lastName: z.string().min(2).max(100).trim().optional(),
	dateOfBirth: z.iso.date('Invalid date format (YYYY-MM-DD)').optional(),
	gender: z.enum(USER_GENDER_ARRAY).optional(),
	phone: z.string().max(30).optional(),
	// Empty string clears the avatar (unset + delete files); a URL sets it.
	profilePictureUrl: z.url().max(500).or(z.literal('')).optional(),
	address: AddressSchema.optional(),
});

export const UpdatePreferencesSchema = z
	.object({
		language: z.string().min(2).max(10).optional(),
		primaryColor: z
			.string()
			.regex(/^#[0-9a-fA-F]{6}$/, 'PREFERENCES_COLOR_INVALID')
			.optional(),
		theme: z.enum(['light', 'dark', 'system']).optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: 'PREFERENCES_EMPTY_UPDATE',
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
export type UpdatePreferencesInput = z.infer<typeof UpdatePreferencesSchema>;
export type ListUsersQuery = z.infer<typeof ListUsersQuerySchema>;
