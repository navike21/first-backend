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
	CreateShippingRuleSchema,
	UpdateShippingRuleSchema,
	ListShippingRulesQuerySchema,
} from './schemas/shippingRule.schema';

const bearerAuth = [{ bearerAuth: [] }];

const moneyResponseSchema = z.object({
	amount: z.number(),
	currency: z.string(),
});

const shippingZoneResponseSchema = z.object({
	region: z.string(),
	provinces: z.array(z.string()).optional(),
});

const shippingRuleResponseSchema = registry.register(
	'ShippingRule',
	z.object({
		id: z.uuid(),
		name: z.string(),
		type: z.enum(['flat', 'free_over_threshold', 'by_zone']),
		amount: moneyResponseSchema,
		freeOverAmount: moneyResponseSchema.optional(),
		zones: z.array(shippingZoneResponseSchema),
		isActive: z.boolean(),
		order: z.number(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/shipping/rules/trash',
	summary: 'List soft-deleted shipping rules',
	description: 'Requires `shipping:read` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({ data: z.array(shippingRuleResponseSchema), meta: paginationMetaSchema }),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/shipping/rules',
	summary: 'List shipping rules',
	description: 'Requires `shipping:read` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: { query: ListShippingRulesQuerySchema },
	responses: {
		200: successResponse(
			z.object({ data: z.array(shippingRuleResponseSchema), meta: paginationMetaSchema }),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/shipping/rules/bulk',
	summary: 'Soft-delete multiple shipping rules',
	description: 'Requires `shipping:delete` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(shippingRuleResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/shipping/rules/bulk/restore',
	summary: 'Restore multiple soft-deleted shipping rules',
	description: 'Requires `shipping:update` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(shippingRuleResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/shipping/rules/bulk/permanent',
	summary: 'Permanently delete multiple shipping rules (from trash only)',
	description: 'Requires `shipping:purge` — `:manage` does NOT grant this.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(shippingRuleResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/shipping/rules/{id}',
	summary: 'Get a shipping rule by id',
	description: 'Requires `shipping:read` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(shippingRuleResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/shipping/rules',
	summary: 'Create a shipping rule',
	description: 'Requires `shipping:create` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: CreateShippingRuleSchema } } },
	},
	responses: {
		201: successResponse(shippingRuleResponseSchema, 'Shipping rule created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/shipping/rules/{id}/restore',
	summary: 'Restore a soft-deleted shipping rule',
	description: 'Requires `shipping:update` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(shippingRuleResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/shipping/rules/{id}',
	summary: 'Update a shipping rule',
	description: 'Requires `shipping:update` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: UpdateShippingRuleSchema } } },
	},
	responses: {
		200: successResponse(shippingRuleResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/shipping/rules/{id}/permanent',
	summary: 'Permanently delete a shipping rule (from trash only)',
	description: 'Requires `shipping:purge` — `:manage` does NOT grant this.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(shippingRuleResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/shipping/rules/{id}',
	summary: 'Soft-delete a shipping rule',
	description: 'Requires `shipping:delete` or `:manage`.',
	tags: ['Shipping'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(shippingRuleResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
