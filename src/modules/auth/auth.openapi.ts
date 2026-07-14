import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
} from '@Config/openapi/responses';
import {
	LoginSchema,
	ChangePasswordSchema,
	ForgotPasswordSchema,
	ResetPasswordSchema,
} from './schemas/auth.schema';

const userPreferencesSchema = z.object({
	language: z.string().optional(),
	primaryColor: z.string().optional(),
	theme: z.enum(['light', 'dark', 'system']),
});

const authUserSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	firstName: z.string(),
	lastName: z.string(),
	profilePictureUrl: z.url().optional(),
	preferences: userPreferencesSchema,
	permissions: z.array(z.string()),
});

const loginResponseSchema = z.object({
	accessToken: z.string(),
	user: authUserSchema,
});

registry.registerPath({
	method: 'post',
	path: '/auth/login',
	summary: 'Log in with email and password',
	description:
		'Rate-limited (5/min). On success, sets an httpOnly refresh-token cookie and returns a short-lived access token.',
	tags: ['Auth'],
	request: {
		body: { content: { 'application/json': { schema: LoginSchema } } },
	},
	responses: {
		200: successResponse(loginResponseSchema, 'Logged in'),
		401: commonErrorResponses[401],
		422: commonErrorResponses[422],
		429: commonErrorResponses[429],
	},
});

registry.registerPath({
	method: 'post',
	path: '/auth/refresh',
	summary: 'Exchange the httpOnly refresh cookie for a new access token',
	description:
		'Reuse of an already-used refresh token revokes every session for that user (replay-attack detection).',
	tags: ['Auth'],
	responses: {
		200: successResponse(
			z.object({ accessToken: z.string() }),
			'New access token issued',
		),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'post',
	path: '/auth/logout',
	summary: 'Revoke the current refresh token and clear the cookie',
	tags: ['Auth'],
	responses: {
		200: successResponse(z.null(), 'Logged out'),
	},
});

registry.registerPath({
	method: 'get',
	path: '/auth/verify-email/{token}',
	summary: 'Verify an email address',
	description: 'Single-use — rejects a token already consumed.',
	tags: ['Auth'],
	request: {
		params: z.object({ token: z.string() }),
	},
	responses: {
		200: successResponse(z.null(), 'Email verified'),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'post',
	path: '/auth/forgot-password',
	summary: 'Request a password-reset email',
	description:
		'Rate-limited (5/min). Always responds 200 regardless of whether the email exists, to avoid account enumeration.',
	tags: ['Auth'],
	request: {
		body: { content: { 'application/json': { schema: ForgotPasswordSchema } } },
	},
	responses: {
		200: successResponse(z.null(), 'Reset email sent (if the account exists)'),
		422: commonErrorResponses[422],
		429: commonErrorResponses[429],
	},
});

registry.registerPath({
	method: 'post',
	path: '/auth/reset-password/{token}',
	summary: 'Reset a password using a reset-email token',
	description:
		'Rate-limited (5/min). Single-use — rejects a token issued before the last password change.',
	tags: ['Auth'],
	request: {
		params: z.object({ token: z.string() }),
		body: { content: { 'application/json': { schema: ResetPasswordSchema } } },
	},
	responses: {
		200: successResponse(z.null(), 'Password reset'),
		401: commonErrorResponses[401],
		422: commonErrorResponses[422],
		429: commonErrorResponses[429],
	},
});

registry.registerPath({
	method: 'post',
	path: '/auth/change-password',
	summary: "Change the current user's password",
	security: [{ bearerAuth: [] }],
	tags: ['Auth'],
	request: {
		body: { content: { 'application/json': { schema: ChangePasswordSchema } } },
	},
	responses: {
		200: successResponse(z.null(), 'Password changed'),
		401: commonErrorResponses[401],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/auth/sessions',
	summary: "List the current user's active sessions",
	security: [{ bearerAuth: [] }],
	tags: ['Auth'],
	responses: {
		200: successResponse(
			z.array(
				z.object({
					userAgent: z.string(),
					ip: z.string(),
					lastSeen: z.iso.datetime(),
					createdAt: z.iso.datetime(),
					updatedAt: z.iso.datetime(),
				}),
			),
			'Active sessions (expire automatically after 7 days of inactivity)',
		),
		401: commonErrorResponses[401],
	},
});
