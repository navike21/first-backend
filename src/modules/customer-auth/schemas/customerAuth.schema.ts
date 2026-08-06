import { z } from 'zod';

const passwordField = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/\d/, 'Password must contain at least one number');

export const RegisterCustomerSchema = z.object({
	firstName: z.string().trim().min(1, 'First name is required').max(100),
	lastName: z.string().trim().min(1, 'Last name is required').max(100),
	email: z
		.email('Invalid email address')
		.trim()
		.transform((v) => v.toLowerCase()),
	password: passwordField,
});

export const CustomerLoginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

export const ForgotCustomerPasswordSchema = z.object({
	email: z.email('Invalid email address'),
});

export const ResetCustomerPasswordSchema = z.object({
	password: passwordField,
});

export type RegisterCustomerInput = z.infer<typeof RegisterCustomerSchema>;
