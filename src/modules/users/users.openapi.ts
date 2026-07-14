import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
	bulkIdsRequestSchema,
	bulkResultSchema,
	paginationMetaSchema,
	multipartWithFile,
} from '@Config/openapi/responses';
import {
	CreateUserSchema,
	UpdateUserSchema,
	UpdateMyProfileSchema,
	UpdatePreferencesSchema,
	ListUsersQuerySchema,
} from './schemas/user.schema';

const bearerAuth = [{ bearerAuth: [] }];

const addressSchema = z.object({
	country: z.string().optional(),
	ubigeoCode: z.string().optional(),
	region: z.string().optional(),
	province: z.string().optional(),
	district: z.string().optional(),
	address: z.string().optional(),
	addressNumber: z.string().optional(),
	addressInterior: z.string().optional(),
});

const userResponseSchema = registry.register(
	'User',
	z.object({
		id: z.uuid(),
		email: z.email(),
		firstName: z.string(),
		lastName: z.string(),
		dateOfBirth: z.iso.date().optional(),
		gender: z.string().optional(),
		phone: z.string().optional(),
		profilePictureUrl: z.url().optional(),
		address: addressSchema.optional(),
		preferences: z.object({
			language: z.string().optional(),
			primaryColor: z.string().optional(),
			theme: z.enum(['light', 'dark', 'system']),
		}),
		groupIds: z.array(z.string()),
		isEmailVerified: z.boolean(),
		status: z.enum(['active', 'inactive']),
		deletedAt: z.iso.datetime().nullable().optional(),
		presenceStatus: z.enum(['available', 'busy', 'away', 'offline']),
		lastSeenAt: z.iso.datetime().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/users/metadata',
	summary: 'Get user-related metadata (e.g. counts) for the admin UI',
	tags: ['Users'],
	security: bearerAuth,
	responses: {
		200: successResponse(z.record(z.string(), z.unknown())),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'get',
	path: '/users/me',
	summary: 'Get the current user profile',
	tags: ['Users'],
	security: bearerAuth,
	responses: {
		200: successResponse(userResponseSchema),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/users/me',
	summary: 'Update the current user profile',
	description:
		'Multipart — optional `avatar` file part replaces the profile picture.',
	tags: ['Users'],
	security: bearerAuth,
	request: { body: multipartWithFile(UpdateMyProfileSchema, ['avatar']) },
	responses: {
		200: successResponse(userResponseSchema),
		401: commonErrorResponses[401],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/users/me/preferences',
	summary: 'Update the current user UI preferences (language, color, theme)',
	tags: ['Users'],
	security: bearerAuth,
	request: {
		body: {
			content: { 'application/json': { schema: UpdatePreferencesSchema } },
		},
	},
	responses: {
		200: successResponse(userResponseSchema.shape.preferences),
		401: commonErrorResponses[401],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/users/me/presence',
	summary:
		'Update the current user presence status (available/busy/away/offline)',
	tags: ['Users'],
	security: bearerAuth,
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						presenceStatus: z.enum(['available', 'busy', 'away', 'offline']),
					}),
				},
			},
		},
	},
	responses: { 200: successResponse(z.null()), 401: commonErrorResponses[401] },
});

registry.registerPath({
	method: 'post',
	path: '/users',
	summary: 'Create a user',
	description:
		'Requires `users:create` or `users:manage`. Multipart — optional `avatar` file part. `password` may be omitted to invite a passwordless user.',
	tags: ['Users'],
	security: bearerAuth,
	request: { body: multipartWithFile(CreateUserSchema, ['avatar']) },
	responses: {
		201: successResponse(userResponseSchema, 'User created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/users/trash',
	summary: 'List soft-deleted users',
	description: 'Requires `users:read` or `users:manage`.',
	tags: ['Users'],
	security: bearerAuth,
	request: { query: ListUsersQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				items: z.array(userResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/users',
	summary: 'List users',
	description: 'Requires `users:read` or `users:manage`.',
	tags: ['Users'],
	security: bearerAuth,
	request: { query: ListUsersQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				items: z.array(userResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/users/{id}',
	summary: 'Get a user by id',
	description: 'Requires `users:read` or `users:manage`.',
	tags: ['Users'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(userResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/users/bulk',
	summary: 'Soft-delete multiple users',
	description: 'Requires `users:delete` or `users:manage`.',
	tags: ['Users'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(userResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/users/bulk/restore',
	summary: 'Restore multiple soft-deleted users',
	description: 'Requires `users:update` or `users:manage`.',
	tags: ['Users'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(userResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/users/bulk/permanent',
	summary: 'Permanently delete multiple users (from trash only)',
	description: 'Requires `users:purge` — `:manage` does NOT grant this.',
	tags: ['Users'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(userResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/users/{id}',
	summary: 'Update a user',
	description:
		'Requires `users:update` or `users:manage`. Multipart — optional `avatar` file part. An admin may set a new `password` here.',
	tags: ['Users'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(UpdateUserSchema, ['avatar']),
	},
	responses: {
		200: successResponse(userResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/users/{id}/restore',
	summary: 'Restore a soft-deleted user',
	description: 'Requires `users:update` or `users:manage`.',
	tags: ['Users'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(userResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/users/{id}',
	summary: 'Soft-delete a user',
	description:
		'Requires `users:delete` or `users:manage`. Blocked for self-deletion and for the last active super-admin.',
	tags: ['Users'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(userResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		409: commonErrorResponses[409],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/users/{id}/permanent',
	summary: 'Permanently delete a user (from trash only)',
	description: 'Requires `users:purge` — `:manage` does NOT grant this.',
	tags: ['Users'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(userResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
