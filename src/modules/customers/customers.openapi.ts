import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
	bulkIdsRequestSchema,
	bulkResultSchema,
	paginationMetaSchema,
} from '@Config/openapi/responses';
import { DOCUMENT_TYPES_ARRAY } from './constants/documentTypes';
import {
	CreateCustomerSchema,
	UpdateCustomerSchema,
	ListCustomersQuerySchema,
} from './schemas/customer.schema';

const bearerAuth = [{ bearerAuth: [] }];

const addressResponseSchema = z.object({
	type: z.enum(['shipping', 'billing']),
	isDefault: z.boolean(),
	country: z.string(),
	ubigeoCode: z.string(),
	region: z.string(),
	province: z.string(),
	district: z.string(),
	address: z.string(),
	addressNumber: z.string(),
	addressInterior: z.string(),
});

const customerResponseSchema = registry.register(
	'Customer',
	z.object({
		id: z.uuid(),
		firstName: z.string(),
		lastName: z.string(),
		email: z.email(),
		phone: z.string().optional(),
		documentType: z.enum(DOCUMENT_TYPES_ARRAY).optional(),
		documentNumber: z.string().optional(),
		addresses: z.array(addressResponseSchema),
		notes: z.string().optional(),
		status: z.enum(['active', 'inactive']),
		emailVerified: z.boolean(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/customers/trash',
	summary: 'List soft-deleted customers',
	description: 'Requires `customers:read` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(customerResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/customers',
	summary: 'List customers',
	description: 'Requires `customers:read` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	request: { query: ListCustomersQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(customerResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/customers/bulk',
	summary: 'Soft-delete multiple customers',
	description: 'Requires `customers:delete` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(customerResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/customers/bulk/restore',
	summary: 'Restore multiple soft-deleted customers',
	description: 'Requires `customers:update` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(customerResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/customers/bulk/permanent',
	summary: 'Permanently delete multiple customers (from trash only)',
	description: 'Requires `customers:purge` — `:manage` does NOT grant this.',
	tags: ['Customers'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(customerResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/customers/{id}',
	summary: 'Get a customer by id',
	description: 'Requires `customers:read` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(customerResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/customers',
	summary: 'Create a customer',
	description: 'Requires `customers:create` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	request: {
		body: {
			content: { 'application/json': { schema: CreateCustomerSchema } },
		},
	},
	responses: {
		201: successResponse(customerResponseSchema, 'Customer created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/customers/{id}/restore',
	summary: 'Restore a soft-deleted customer',
	description: 'Requires `customers:update` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(customerResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/customers/{id}',
	summary: 'Update a customer',
	description: 'Requires `customers:update` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: { 'application/json': { schema: UpdateCustomerSchema } },
		},
	},
	responses: {
		200: successResponse(customerResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/customers/{id}/permanent',
	summary: 'Permanently delete a customer (from trash only)',
	description: 'Requires `customers:purge` — `:manage` does NOT grant this.',
	tags: ['Customers'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(customerResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/customers/{id}',
	summary: 'Soft-delete a customer',
	description: 'Requires `customers:delete` or `:manage`.',
	tags: ['Customers'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(customerResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
