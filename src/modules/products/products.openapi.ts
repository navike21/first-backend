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
	CreateProductSchema,
	UpdateProductSchema,
	ListProductsQuerySchema,
} from './schemas/product.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const moneyResponseSchema = z.object({
	amount: z.number().int(),
	currency: z.string(),
});

const variantResponseSchema = z.object({
	id: z.uuid(),
	sku: z.string().optional(),
	optionValues: z.record(z.string(), z.string()),
	price: moneyResponseSchema,
	compareAtPrice: moneyResponseSchema.optional(),
	imageUrl: z.url().optional(),
});

const productResponseSchema = registry.register(
	'Product',
	z.object({
		id: z.uuid(),
		slug: localizedString,
		name: localizedString,
		shortDescription: localizedString.optional(),
		description: localizedString.optional(),
		sku: z.string().optional(),
		price: moneyResponseSchema,
		compareAtPrice: moneyResponseSchema.optional(),
		categoryIds: z.array(z.uuid()),
		tagIds: z.array(z.uuid()),
		gallery: z.array(z.url()),
		status: z.enum(['draft', 'active', 'archived']),
		seo: z
			.object({
				metaTitle: localizedString.optional(),
				metaDescription: localizedString.optional(),
				keywords: localizedString.optional(),
				ogImage: z.url().optional(),
			})
			.optional(),
		hasVariants: z.boolean(),
		variantOptions: z.array(
			z.object({ name: localizedString, values: z.array(z.string()) }),
		),
		variants: z.array(variantResponseSchema),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/products',
	summary: 'List active products (public)',
	tags: ['Products'],
	request: { query: ListProductsQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(productResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
	},
});

registry.registerPath({
	method: 'get',
	path: '/products/admin',
	summary: 'List products (admin — includes draft/archived)',
	description: 'Requires `products:read` or `:manage`.',
	tags: ['Products'],
	security: bearerAuth,
	request: { query: ListProductsQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(productResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/products/trash',
	summary: 'List soft-deleted products',
	description: 'Requires `products:read` or `:manage`.',
	tags: ['Products'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(productResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/products/id/{id}',
	summary: 'Get a product by id (admin)',
	description: 'Requires `products:read` or `:manage`.',
	tags: ['Products'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(productResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'get',
	path: '/products/{slug}',
	summary: 'Get an active product by slug (public)',
	tags: ['Products'],
	request: { params: z.object({ slug: z.string() }) },
	responses: {
		200: successResponse(productResponseSchema),
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/products/bulk',
	summary: 'Soft-delete multiple products',
	description: 'Requires `products:delete` or `:manage`.',
	tags: ['Products'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(productResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/products/bulk/restore',
	summary: 'Restore multiple soft-deleted products',
	description: 'Requires `products:update` or `:manage`.',
	tags: ['Products'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(productResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/products/bulk/permanent',
	summary: 'Permanently delete multiple products (from trash only)',
	description: 'Requires `products:purge` — `:manage` does NOT grant this.',
	tags: ['Products'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(productResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'post',
	path: '/products',
	summary: 'Create a product',
	description:
		'Requires `products:create` or `:manage`. Multipart — up to 10 `gallery` file parts (or URLs in `gallery` within `data`); the first gallery image is the cover.',
	tags: ['Products'],
	security: bearerAuth,
	request: {
		body: multipartWithFile(CreateProductSchema, ['gallery']),
	},
	responses: {
		201: successResponse(productResponseSchema, 'Product created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/products/{id}/restore',
	summary: 'Restore a soft-deleted product',
	description: 'Requires `products:update` or `:manage`.',
	tags: ['Products'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(productResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/products/{id}',
	summary: 'Update a product',
	description:
		'Requires `products:update` or `:manage`. Multipart — optional `gallery` file parts + `galleryOrder` in `data` to reconcile gallery order.',
	tags: ['Products'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(UpdateProductSchema, ['gallery']),
	},
	responses: {
		200: successResponse(productResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/products/{id}/permanent',
	summary: 'Permanently delete a product (from trash only)',
	description: 'Requires `products:purge` — `:manage` does NOT grant this.',
	tags: ['Products'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(productResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/products/{id}',
	summary: 'Soft-delete a product',
	description: 'Requires `products:delete` or `:manage`.',
	tags: ['Products'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(productResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
