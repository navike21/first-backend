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
	CreateProductCategorySchema,
	UpdateProductCategorySchema,
	ListProductCategoriesQuerySchema,
} from './schemas/productCategory.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const productCategoryResponseSchema = registry.register(
	'ProductCategory',
	z.object({
		id: z.uuid(),
		name: localizedString,
		slug: localizedString,
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
	path: '/product-categories',
	summary: 'List active product categories (public)',
	tags: ['Product Categories'],
	responses: {
		200: successResponse(z.array(productCategoryResponseSchema)),
	},
});

registry.registerPath({
	method: 'get',
	path: '/product-categories/trash',
	summary: 'List soft-deleted product categories',
	description: 'Requires `product-categories:read` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(productCategoryResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/product-categories/admin',
	summary: 'List product categories (admin — includes inactive)',
	description: 'Requires `product-categories:read` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: { query: ListProductCategoriesQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(productCategoryResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/product-categories/bulk',
	summary: 'Soft-delete multiple product categories',
	description: 'Requires `product-categories:delete` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(productCategoryResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/product-categories/bulk/restore',
	summary: 'Restore multiple soft-deleted product categories',
	description: 'Requires `product-categories:update` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(productCategoryResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/product-categories/bulk/permanent',
	summary: 'Permanently delete multiple product categories (from trash only)',
	description:
		'Requires `product-categories:purge` — `:manage` does NOT grant this.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(productCategoryResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/product-categories/{id}',
	summary: 'Get a product category by id',
	description: 'Requires `product-categories:read` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(productCategoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/product-categories',
	summary: 'Create a product category',
	description: 'Requires `product-categories:create` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: {
		body: {
			content: { 'application/json': { schema: CreateProductCategorySchema } },
		},
	},
	responses: {
		201: successResponse(
			productCategoryResponseSchema,
			'Product category created',
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/product-categories/{id}/restore',
	summary: 'Restore a soft-deleted product category',
	description: 'Requires `product-categories:update` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(productCategoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/product-categories/{id}',
	summary: 'Update a product category',
	description: 'Requires `product-categories:update` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: { 'application/json': { schema: UpdateProductCategorySchema } },
		},
	},
	responses: {
		200: successResponse(productCategoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/product-categories/{id}/permanent',
	summary: 'Permanently delete a product category (from trash only)',
	description:
		'Requires `product-categories:purge` — `:manage` does NOT grant this.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(productCategoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/product-categories/{id}',
	summary: 'Soft-delete a product category',
	description: 'Requires `product-categories:delete` or `:manage`.',
	tags: ['Product Categories'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(productCategoryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
