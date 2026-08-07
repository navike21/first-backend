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
	CreateCouponSchema,
	UpdateCouponSchema,
	ListCouponsQuerySchema,
} from './schemas/coupon.schema';

const bearerAuth = [{ bearerAuth: [] }];

const moneyResponseSchema = z.object({
	amount: z.number(),
	currency: z.string(),
});

const couponScopeResponseSchema = z.object({
	type: z.enum(['cart', 'products', 'categories']),
	targetIds: z.array(z.uuid()),
});

const couponResponseSchema = registry.register(
	'Coupon',
	z.object({
		id: z.uuid(),
		code: z.string(),
		type: z.enum(['percentage', 'fixed']),
		value: z.number(),
		maxDiscountAmount: moneyResponseSchema.optional(),
		usageLimitTotal: z.number().optional(),
		usageLimitPerCustomer: z.number().optional(),
		timesUsed: z.number(),
		startsAt: z.iso.datetime().optional(),
		expiresAt: z.iso.datetime().optional(),
		isStackable: z.boolean(),
		scope: couponScopeResponseSchema,
		status: z.enum(['active', 'inactive']),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/coupons/trash',
	summary: 'List soft-deleted coupons',
	description: 'Requires `coupons:read` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({ data: z.array(couponResponseSchema), meta: paginationMetaSchema }),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/coupons',
	summary: 'List coupons',
	description: 'Requires `coupons:read` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: { query: ListCouponsQuerySchema },
	responses: {
		200: successResponse(
			z.object({ data: z.array(couponResponseSchema), meta: paginationMetaSchema }),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/coupons/bulk',
	summary: 'Soft-delete multiple coupons',
	description: 'Requires `coupons:delete` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(couponResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/coupons/bulk/restore',
	summary: 'Restore multiple soft-deleted coupons',
	description: 'Requires `coupons:update` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(couponResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/coupons/bulk/permanent',
	summary: 'Permanently delete multiple coupons (from trash only)',
	description: 'Requires `coupons:purge` — `:manage` does NOT grant this.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(couponResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/coupons/{id}',
	summary: 'Get a coupon by id',
	description: 'Requires `coupons:read` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(couponResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/coupons',
	summary: 'Create a coupon',
	description: 'Requires `coupons:create` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: CreateCouponSchema } } },
	},
	responses: {
		201: successResponse(couponResponseSchema, 'Coupon created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/coupons/{id}/restore',
	summary: 'Restore a soft-deleted coupon',
	description: 'Requires `coupons:update` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(couponResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/coupons/{id}',
	summary: 'Update a coupon',
	description: 'Requires `coupons:update` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: UpdateCouponSchema } } },
	},
	responses: {
		200: successResponse(couponResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/coupons/{id}/permanent',
	summary: 'Permanently delete a coupon (from trash only)',
	description: 'Requires `coupons:purge` — `:manage` does NOT grant this.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(couponResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/coupons/{id}',
	summary: 'Soft-delete a coupon',
	description: 'Requires `coupons:delete` or `:manage`.',
	tags: ['Coupons'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(couponResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
