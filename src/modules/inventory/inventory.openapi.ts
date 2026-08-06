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
	CreateLocationSchema,
	UpdateLocationSchema,
	ListLocationsQuerySchema,
} from './schemas/location.schema';
import { AdjustStockSchema } from './schemas/stock.schema';

const bearerAuth = [{ bearerAuth: [] }];

const addressResponseSchema = z.object({
	country: z.string(),
	ubigeoCode: z.string(),
	region: z.string(),
	province: z.string(),
	district: z.string(),
	address: z.string(),
	addressNumber: z.string(),
	addressInterior: z.string(),
});

const locationResponseSchema = registry.register(
	'Location',
	z.object({
		id: z.uuid(),
		name: z.string(),
		type: z.enum(['warehouse', 'store']),
		address: addressResponseSchema,
		fulfillsOnline: z.boolean(),
		isActive: z.boolean(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

const stockSummaryResponseSchema = registry.register(
	'StockSummary',
	z.object({
		productId: z.string(),
		total: z.number(),
		byLocation: z.array(
			z.object({
				locationId: z.uuid(),
				locationName: z.string(),
				variantId: z.uuid().nullable(),
				quantity: z.number(),
			}),
		),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/inventory/locations/trash',
	summary: 'List soft-deleted locations',
	description: 'Requires `inventory:read` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(locationResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/inventory/locations',
	summary: 'List locations',
	description: 'Requires `inventory:read` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: { query: ListLocationsQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(locationResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/inventory/locations/bulk',
	summary: 'Soft-delete multiple locations',
	description: 'Requires `inventory:delete` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(locationResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/inventory/locations/bulk/restore',
	summary: 'Restore multiple soft-deleted locations',
	description: 'Requires `inventory:update` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(locationResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/inventory/locations/bulk/permanent',
	summary: 'Permanently delete multiple locations (from trash only)',
	description: 'Requires `inventory:purge` — `:manage` does NOT grant this.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(locationResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/inventory/stock',
	summary:
		'Set the absolute stock quantity for a product(+variant) at a location',
	description:
		'Requires `inventory:update` or `:manage`. Upserts — not an increment.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: AdjustStockSchema } } },
	},
	responses: {
		200: successResponse(z.object({ quantity: z.number() })),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/inventory/stock/{productId}',
	summary: 'Get the aggregate stock and per-location breakdown for a product',
	description: 'Requires `inventory:read` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: { params: z.object({ productId: z.string() }) },
	responses: {
		200: successResponse(stockSummaryResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/inventory/locations/{id}',
	summary: 'Get a location by id',
	description: 'Requires `inventory:read` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(locationResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/inventory/locations',
	summary: 'Create a location',
	description: 'Requires `inventory:create` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: {
		body: {
			content: { 'application/json': { schema: CreateLocationSchema } },
		},
	},
	responses: {
		201: successResponse(locationResponseSchema, 'Location created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/inventory/locations/{id}/restore',
	summary: 'Restore a soft-deleted location',
	description: 'Requires `inventory:update` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(locationResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/inventory/locations/{id}',
	summary: 'Update a location',
	description: 'Requires `inventory:update` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: { 'application/json': { schema: UpdateLocationSchema } },
		},
	},
	responses: {
		200: successResponse(locationResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/inventory/locations/{id}/permanent',
	summary: 'Permanently delete a location (from trash only)',
	description: 'Requires `inventory:purge` — `:manage` does NOT grant this.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(locationResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/inventory/locations/{id}',
	summary: 'Soft-delete a location',
	description: 'Requires `inventory:delete` or `:manage`.',
	tags: ['Inventory'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(locationResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
