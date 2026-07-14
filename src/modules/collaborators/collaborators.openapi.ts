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
	CreateCollaboratorSchema,
	UpdateCollaboratorSchema,
	ListCollaboratorQuerySchema,
} from './schemas/collaborator.schema';

const bearerAuth = [{ bearerAuth: [] }];

const socialLinksSchema = z.object({
	linkedin: z.url().optional(),
	twitter: z.url().optional(),
	github: z.url().optional(),
	website: z.url().optional(),
	instagram: z.url().optional(),
});

const collaboratorResponseSchema = registry.register(
	'Collaborator',
	z.object({
		id: z.uuid(),
		name: z.string(),
		role: z.string(),
		level: z.string().optional(),
		bio: z.string(),
		photoUrl: z.url().optional(),
		socialLinks: socialLinksSchema.optional(),
		userId: z.uuid().optional(),
		order: z.number(),
		isActive: z.boolean(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/collaborators',
	summary: 'List active collaborators (public)',
	tags: ['Collaborators'],
	responses: { 200: successResponse(z.array(collaboratorResponseSchema)) },
});

registry.registerPath({
	method: 'get',
	path: '/collaborators/trash',
	summary: 'List soft-deleted collaborators',
	description: 'Requires `collaborators:read` or `:manage`.',
	tags: ['Collaborators'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(collaboratorResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/collaborators/admin',
	summary: 'List collaborators (admin — includes inactive)',
	description: 'Requires `collaborators:read` or `:manage`.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: { query: ListCollaboratorQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(collaboratorResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/collaborators/bulk',
	summary: 'Soft-delete multiple collaborators',
	description: 'Requires `collaborators:delete` or `:manage`.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(collaboratorResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/collaborators/bulk/restore',
	summary: 'Restore multiple soft-deleted collaborators',
	description: 'Requires `collaborators:update` or `:manage`.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(collaboratorResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/collaborators/bulk/permanent',
	summary: 'Permanently delete multiple collaborators (from trash only)',
	description:
		'Requires `collaborators:purge` — `:manage` does NOT grant this.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(collaboratorResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/collaborators/{id}',
	summary: 'Get a collaborator by id',
	description: 'Requires `collaborators:read` or `:manage`.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(collaboratorResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/collaborators',
	summary: 'Create a collaborator',
	description:
		'Requires `collaborators:create` or `:manage`. Multipart — optional `photo` file part.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: { body: multipartWithFile(CreateCollaboratorSchema, ['photo']) },
	responses: {
		201: successResponse(collaboratorResponseSchema, 'Collaborator created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/collaborators/{id}/restore',
	summary: 'Restore a soft-deleted collaborator',
	description: 'Requires `collaborators:update` or `:manage`.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(collaboratorResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/collaborators/{id}',
	summary: 'Update a collaborator',
	description:
		'Requires `collaborators:update` or `:manage`. Multipart — optional `photo` file part.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(UpdateCollaboratorSchema, ['photo']),
	},
	responses: {
		200: successResponse(collaboratorResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/collaborators/{id}/permanent',
	summary: 'Permanently delete a collaborator (from trash only)',
	description:
		'Requires `collaborators:purge` — `:manage` does NOT grant this.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(collaboratorResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/collaborators/{id}',
	summary: 'Soft-delete a collaborator',
	description: 'Requires `collaborators:delete` or `:manage`.',
	tags: ['Collaborators'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(collaboratorResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
