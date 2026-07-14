import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
	bulkIdsRequestSchema,
	bulkResultSchema,
	paginationMetaSchema,
} from '@Config/openapi/responses';
import {
	CreateTagSchema,
	UpdateTagSchema,
	ListTagsQuerySchema,
} from './schemas/tag.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const tagResponseSchema = registry.register(
	'Tag',
	z.object({
		id: z.uuid(),
		name: localizedString,
		slug: z.string(),
		order: z.number(),
		isActive: z.boolean(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/tags',
	summary: 'List active tags (public)',
	tags: ['Tags'],
	responses: { 200: successResponse(z.array(tagResponseSchema)) },
});

registry.registerPath({
	method: 'get',
	path: '/tags/trash',
	summary: 'List soft-deleted tags',
	description: 'Requires `tags:read` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(tagResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/tags/admin',
	summary: 'List tags (admin — includes inactive)',
	description: 'Requires `tags:read` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	request: { query: ListTagsQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(tagResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/tags/bulk',
	summary: 'Soft-delete multiple tags',
	description: 'Requires `tags:delete` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(tagResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/tags/bulk/restore',
	summary: 'Restore multiple soft-deleted tags',
	description: 'Requires `tags:update` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(tagResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/tags/bulk/permanent',
	summary: 'Permanently delete multiple tags (from trash only)',
	description: 'Requires `tags:purge` — `:manage` does NOT grant this.',
	tags: ['Tags'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(tagResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/tags/{id}',
	summary: 'Get a tag by id',
	description: 'Requires `tags:read` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(tagResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/tags',
	summary: 'Create a tag',
	description: 'Requires `tags:create` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: CreateTagSchema } } },
	},
	responses: {
		201: successResponse(tagResponseSchema, 'Tag created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/tags/{id}/restore',
	summary: 'Restore a soft-deleted tag',
	description: 'Requires `tags:update` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(tagResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/tags/{id}',
	summary: 'Update a tag',
	description: 'Requires `tags:update` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: UpdateTagSchema } } },
	},
	responses: {
		200: successResponse(tagResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/tags/{id}/permanent',
	summary: 'Permanently delete a tag (from trash only)',
	description: 'Requires `tags:purge` — `:manage` does NOT grant this.',
	tags: ['Tags'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(tagResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/tags/{id}',
	summary: 'Soft-delete a tag',
	description: 'Requires `tags:delete` or `:manage`.',
	tags: ['Tags'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(tagResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
