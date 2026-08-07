import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
	bulkIdsRequestSchema,
	bulkResultSchema,
	paginationMetaSchema,
} from '@Config/openapi/responses';
import { PAYMENT_PROVIDER_KEYS } from './constants/providerRegistry';
import {
	CreatePaymentMethodSchema,
	UpdatePaymentMethodSchema,
	ListPaymentMethodsQuerySchema,
} from './schemas/paymentMethod.schema';

const bearerAuth = [{ bearerAuth: [] }];

const providerFieldResponseSchema = z.object({
	key: z.string(),
	label: z.string(),
	type: z.enum(['text', 'password']),
	required: z.boolean(),
});

const providerConfigResponseSchema = registry.register(
	'PaymentProviderConfig',
	z.object({
		provider: z.enum(PAYMENT_PROVIDER_KEYS),
		label: z.string(),
		fields: z.array(providerFieldResponseSchema),
		enabled: z.boolean(),
		isDefault: z.boolean(),
		// Write-only (`password`-type) fields are never included here.
		config: z.record(z.string(), z.string()),
	}),
);

const updateProviderConfigBodySchema = z.object({
	enabled: z.boolean().optional(),
	isDefault: z.boolean().optional(),
	config: z.record(z.string(), z.string()).optional(),
});

const paymentMethodResponseSchema = registry.register(
	'PaymentMethod',
	z.object({
		id: z.uuid(),
		customerId: z.uuid(),
		provider: z.enum(PAYMENT_PROVIDER_KEYS),
		providerToken: z.string(),
		brand: z.string(),
		last4: z.string(),
		expiryMonth: z.number(),
		expiryYear: z.number(),
		isDefault: z.boolean(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/payments/providers',
	summary: 'List all known payment providers and their saved configuration',
	description:
		'Requires `payments:read` or `:manage`. Always returns all providers in ' +
		'the registry (culqi/mercadopago/stripe/manual), merged with defaults ' +
		'for any that have never been configured. Secret fields are omitted.',
	tags: ['Payments'],
	security: bearerAuth,
	responses: {
		200: successResponse(z.array(providerConfigResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/payments/providers/{provider}',
	summary: 'Enable/configure a known payment provider',
	description:
		'Requires `payments:update` or `:manage`. `config`, when provided, must ' +
		"satisfy that provider's full field list (see the provider list " +
		'response) — it replaces the stored config, it is not merged key by key.',
	tags: ['Payments'],
	security: bearerAuth,
	request: {
		params: z.object({ provider: z.enum(PAYMENT_PROVIDER_KEYS) }),
		body: { content: { 'application/json': { schema: updateProviderConfigBodySchema } } },
	},
	responses: {
		200: successResponse(providerConfigResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/payments/methods/trash',
	summary: 'List soft-deleted payment methods',
	description: 'Requires `payments:read` or `:manage`.',
	tags: ['Payments'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({ data: z.array(paymentMethodResponseSchema), meta: paginationMetaSchema }),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/payments/methods',
	summary: 'List saved customer payment methods',
	description: 'Requires `payments:read` or `:manage`.',
	tags: ['Payments'],
	security: bearerAuth,
	request: { query: ListPaymentMethodsQuerySchema },
	responses: {
		200: successResponse(
			z.object({ data: z.array(paymentMethodResponseSchema), meta: paginationMetaSchema }),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/payments/methods/bulk',
	summary: 'Soft-delete multiple payment methods',
	description: 'Requires `payments:delete` or `:manage`.',
	tags: ['Payments'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(paymentMethodResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/payments/methods/bulk/restore',
	summary: 'Restore multiple soft-deleted payment methods',
	description: 'Requires `payments:update` or `:manage`.',
	tags: ['Payments'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(paymentMethodResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/payments/methods/bulk/permanent',
	summary: 'Permanently delete multiple payment methods (from trash only)',
	description: 'Requires `payments:purge` — `:manage` does NOT grant this.',
	tags: ['Payments'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(paymentMethodResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/payments/methods/{id}',
	summary: 'Get a payment method by id',
	description: 'Requires `payments:read` or `:manage`.',
	tags: ['Payments'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(paymentMethodResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/payments/methods',
	summary: 'Save a customer payment method',
	description:
		'Requires `payments:create` or `:manage`. No real tokenization flow is ' +
		'connected yet — filled via API/admin for testing (see plan).',
	tags: ['Payments'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: CreatePaymentMethodSchema } } },
	},
	responses: {
		201: successResponse(paymentMethodResponseSchema, 'Payment method created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/payments/methods/{id}/restore',
	summary: 'Restore a soft-deleted payment method',
	description: 'Requires `payments:update` or `:manage`.',
	tags: ['Payments'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(paymentMethodResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/payments/methods/{id}',
	summary: 'Update a payment method',
	description: 'Requires `payments:update` or `:manage`.',
	tags: ['Payments'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: UpdatePaymentMethodSchema } } },
	},
	responses: {
		200: successResponse(paymentMethodResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/payments/methods/{id}/permanent',
	summary: 'Permanently delete a payment method (from trash only)',
	description: 'Requires `payments:purge` — `:manage` does NOT grant this.',
	tags: ['Payments'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(paymentMethodResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/payments/methods/{id}',
	summary: 'Soft-delete a payment method',
	description: 'Requires `payments:delete` or `:manage`.',
	tags: ['Payments'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(paymentMethodResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
