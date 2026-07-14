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
	CreateClientSchema,
	UpdateClientSchema,
	ListClientsQuerySchema,
} from './schemas/client.schema';

const bearerAuth = [{ bearerAuth: [] }];

const clientResponseSchema = registry.register(
	'Client',
	z.object({
		id: z.uuid(),
		businessName: z.string(),
		clientType: z.enum(['person', 'company']),
		documentType: z.string().optional(),
		documentNumber: z.string().optional(),
		country: z.string(),
		logoUrl: z.url().optional(),
		website: z.url().optional(),
		industry: z.string().optional(),
		status: z.enum(['active', 'inactive']),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'post',
	path: '/clients',
	summary: 'Create a client',
	description:
		'Requires `clients:create` or `:manage`. Multipart — optional `logo` file part.',
	tags: ['Clients'],
	security: bearerAuth,
	request: { body: multipartWithFile(CreateClientSchema, ['logo']) },
	responses: {
		201: successResponse(clientResponseSchema, 'Client created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/clients/trash',
	summary: 'List soft-deleted clients',
	description: 'Requires `clients:read` or `:manage`.',
	tags: ['Clients'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(clientResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/clients',
	summary: 'List clients',
	description: 'Requires `clients:read` or `:manage`.',
	tags: ['Clients'],
	security: bearerAuth,
	request: { query: ListClientsQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(clientResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/clients/bulk',
	summary: 'Soft-delete multiple clients',
	description: 'Requires `clients:delete` or `:manage`.',
	tags: ['Clients'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(clientResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/clients/bulk/restore',
	summary: 'Restore multiple soft-deleted clients',
	description: 'Requires `clients:update` or `:manage`.',
	tags: ['Clients'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(clientResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/clients/bulk/permanent',
	summary: 'Permanently delete multiple clients (from trash only)',
	description: 'Requires `clients:purge` — `:manage` does NOT grant this.',
	tags: ['Clients'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(clientResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/clients/{id}',
	summary: 'Get a client by id',
	description: 'Requires `clients:read` or `:manage`.',
	tags: ['Clients'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(clientResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/clients/{id}/restore',
	summary: 'Restore a soft-deleted client',
	description: 'Requires `clients:update` or `:manage`.',
	tags: ['Clients'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(clientResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/clients/{id}',
	summary: 'Update a client',
	description:
		'Requires `clients:update` or `:manage`. Multipart — optional `logo` file part.',
	tags: ['Clients'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(UpdateClientSchema, ['logo']),
	},
	responses: {
		200: successResponse(clientResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/clients/{id}/permanent',
	summary: 'Permanently delete a client (from trash only)',
	description: 'Requires `clients:purge` — `:manage` does NOT grant this.',
	tags: ['Clients'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(clientResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/clients/{id}',
	summary: 'Soft-delete a client',
	description: 'Requires `clients:delete` or `:manage`.',
	tags: ['Clients'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(clientResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
