import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
} from '@Config/openapi/responses';
import {
	RegisterCustomerSchema,
	CustomerLoginSchema,
	ForgotCustomerPasswordSchema,
	ResetCustomerPasswordSchema,
} from './schemas/customerAuth.schema';

const customerSummarySchema = z.object({
	id: z.uuid(),
	email: z.email(),
	firstName: z.string(),
	lastName: z.string(),
});

const loginResponseSchema = z.object({
	accessToken: z.string(),
	customer: customerSummarySchema,
});

registry.registerPath({
	method: 'post',
	path: '/customer-auth/register',
	summary: 'Register a new customer account',
	description:
		'Rate-limited (5/min). Self-service — independent of staff `users` and CRM `clients`.',
	tags: ['Customer Auth'],
	request: {
		body: {
			content: { 'application/json': { schema: RegisterCustomerSchema } },
		},
	},
	responses: {
		201: successResponse(customerSummarySchema, 'Account created'),
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
		429: commonErrorResponses[429],
	},
});

registry.registerPath({
	method: 'post',
	path: '/customer-auth/login',
	summary: 'Log in with email and password (customer realm)',
	description:
		'Rate-limited (5/min). Sets an httpOnly `customerRefreshToken` cookie scoped to `/api/v1/customer-auth`, fully separate from the staff auth cookie/secrets.',
	tags: ['Customer Auth'],
	request: {
		body: { content: { 'application/json': { schema: CustomerLoginSchema } } },
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
	path: '/customer-auth/refresh',
	summary:
		'Exchange the httpOnly customer refresh cookie for a new access token',
	description:
		'Reuse of an already-used refresh token revokes every session for that customer (replay-attack detection).',
	tags: ['Customer Auth'],
	responses: {
		200: successResponse(z.object({ accessToken: z.string() })),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'post',
	path: '/customer-auth/logout',
	summary: 'Log out and revoke the current refresh token',
	tags: ['Customer Auth'],
	responses: { 200: successResponse(z.null()) },
});

registry.registerPath({
	method: 'post',
	path: '/customer-auth/forgot-password',
	summary: 'Request a password reset email',
	description:
		'Rate-limited (5/min). Always responds the same way regardless of whether the email exists.',
	tags: ['Customer Auth'],
	request: {
		body: {
			content: {
				'application/json': { schema: ForgotCustomerPasswordSchema },
			},
		},
	},
	responses: {
		200: successResponse(z.null()),
		422: commonErrorResponses[422],
		429: commonErrorResponses[429],
	},
});

registry.registerPath({
	method: 'post',
	path: '/customer-auth/reset-password/{token}',
	summary: 'Reset the password using a token from the reset email',
	description:
		'Rate-limited (5/min). Single-use — revokes all active sessions.',
	tags: ['Customer Auth'],
	request: {
		params: z.object({ token: z.string() }),
		body: {
			content: {
				'application/json': { schema: ResetCustomerPasswordSchema },
			},
		},
	},
	responses: {
		200: successResponse(z.null()),
		401: commonErrorResponses[401],
		422: commonErrorResponses[422],
		429: commonErrorResponses[429],
	},
});
