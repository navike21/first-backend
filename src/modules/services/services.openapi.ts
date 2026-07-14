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
	CreateServiceSchema,
	UpdateServiceSchema,
	ListServicesQuerySchema,
} from './schemas/service.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const serviceResponseSchema = registry.register(
	'Service',
	z.object({
		id: z.uuid(),
		slug: localizedString,
		name: localizedString,
		shortDescription: localizedString,
		description: localizedString,
		icon: z.string().optional(),
		coverImageUrl: z.url().optional(),
		pillars: z.array(z.string()),
		highlights: z.array(localizedString),
		tags: z.array(z.string()),
		order: z.number(),
		isActive: z.boolean(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/services',
	summary: 'List services (public)',
	tags: ['Services'],
	request: { query: ListServicesQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(serviceResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
	},
});

registry.registerPath({
	method: 'get',
	path: '/services/admin',
	summary: 'List services (admin — includes inactive)',
	description: 'Requires `services:read` or `:manage`.',
	tags: ['Services'],
	security: bearerAuth,
	request: { query: ListServicesQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(serviceResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/services/trash',
	summary: 'List soft-deleted services',
	description: 'Requires `services:read` or `:manage`.',
	tags: ['Services'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(serviceResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/services/id/{id}',
	summary: 'Get a service by id (admin)',
	description: 'Requires `services:read` or `:manage`.',
	tags: ['Services'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(serviceResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'get',
	path: '/services/{slug}',
	summary: 'Get a service by slug (public)',
	tags: ['Services'],
	request: { params: z.object({ slug: z.string() }) },
	responses: {
		200: successResponse(serviceResponseSchema),
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/services/bulk',
	summary: 'Soft-delete multiple services',
	description: 'Requires `services:delete` or `:manage`.',
	tags: ['Services'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(serviceResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/services/bulk/restore',
	summary: 'Restore multiple soft-deleted services',
	description: 'Requires `services:update` or `:manage`.',
	tags: ['Services'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(serviceResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/services/bulk/permanent',
	summary: 'Permanently delete multiple services (from trash only)',
	description: 'Requires `services:purge` — `:manage` does NOT grant this.',
	tags: ['Services'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(serviceResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'post',
	path: '/services',
	summary: 'Create a service',
	description:
		'Requires `services:create` or `:manage`. Multipart — optional `cover`/`icon` file parts.',
	tags: ['Services'],
	security: bearerAuth,
	request: { body: multipartWithFile(CreateServiceSchema, ['cover', 'icon']) },
	responses: {
		201: successResponse(serviceResponseSchema, 'Service created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/services/{id}/restore',
	summary: 'Restore a soft-deleted service',
	description: 'Requires `services:update` or `:manage`.',
	tags: ['Services'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(serviceResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/services/{id}',
	summary: 'Update a service',
	description:
		'Requires `services:update` or `:manage`. Multipart — optional `cover`/`icon` file parts.',
	tags: ['Services'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(UpdateServiceSchema, ['cover', 'icon']),
	},
	responses: {
		200: successResponse(serviceResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/services/{id}/permanent',
	summary: 'Permanently delete a service (from trash only)',
	description: 'Requires `services:purge` — `:manage` does NOT grant this.',
	tags: ['Services'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(serviceResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/services/{id}',
	summary: 'Soft-delete a service',
	description: 'Requires `services:delete` or `:manage`.',
	tags: ['Services'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(serviceResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
