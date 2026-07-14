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
	CreateCategorySchema,
	UpdateCategorySchema,
	ListCategoriesQuerySchema,
} from './schemas/category.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const categoryResponseSchema = registry.register(
	'Category',
	z.object({
		id: z.uuid(),
		name: localizedString,
		slug: z.string(),
		parentId: z.uuid().optional(),
		order: z.number(),
		isActive: z.boolean(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/categories',
	summary: 'List active categories (public)',
	tags: ['Categories'],
	responses: { 200: successResponse(z.array(categoryResponseSchema)) },
});

registry.registerPath({
	method: 'get',
	path: '/categories/trash',
	summary: 'List soft-deleted categories',
	description: 'Requires `categories:read` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(categoryResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/categories/admin',
	summary: 'List categories (admin — includes inactive)',
	description: 'Requires `categories:read` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	request: { query: ListCategoriesQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(categoryResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/categories/bulk',
	summary: 'Soft-delete multiple categories',
	description: 'Requires `categories:delete` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(categoryResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/categories/bulk/restore',
	summary: 'Restore multiple soft-deleted categories',
	description: 'Requires `categories:update` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(categoryResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/categories/bulk/permanent',
	summary: 'Permanently delete multiple categories (from trash only)',
	description: 'Requires `categories:purge` — `:manage` does NOT grant this.',
	tags: ['Categories'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(categoryResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/categories/{id}',
	summary: 'Get a category by id',
	description: 'Requires `categories:read` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(categoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/categories',
	summary: 'Create a category',
	description: 'Requires `categories:create` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: CreateCategorySchema } } },
	},
	responses: {
		201: successResponse(categoryResponseSchema, 'Category created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/categories/{id}/restore',
	summary: 'Restore a soft-deleted category',
	description: 'Requires `categories:update` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(categoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/categories/{id}',
	summary: 'Update a category',
	description: 'Requires `categories:update` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: UpdateCategorySchema } } },
	},
	responses: {
		200: successResponse(categoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/categories/{id}/permanent',
	summary: 'Permanently delete a category (from trash only)',
	description: 'Requires `categories:purge` — `:manage` does NOT grant this.',
	tags: ['Categories'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(categoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/categories/{id}',
	summary: 'Soft-delete a category',
	description: 'Requires `categories:delete` or `:manage`.',
	tags: ['Categories'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(categoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
