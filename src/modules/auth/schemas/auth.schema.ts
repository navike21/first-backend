import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

export const ChangePasswordSchema = z.object({
	currentPassword: z.string().min(1, 'Current password is required'),
	newPassword: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/\d/, 'Password must contain at least one number'),
});

export const ForgotPasswordSchema = z.object({
	email: z.email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/\d/, 'Password must contain at least one number'),
});
