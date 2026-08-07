import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
} from '@Config/openapi/responses';
import {
	AddCartItemSchema,
	UpdateCartItemQuantitySchema,
	RemoveCartItemSchema,
} from './schemas/cart.schema';

const customerBearerAuth = [{ customerBearerAuth: [] }];

const cartItemResponseSchema = z.object({
	productId: z.uuid(),
	variantId: z.uuid().nullable(),
	quantity: z.number(),
	addedAt: z.iso.datetime(),
});

const cartResponseSchema = registry.register(
	'Cart',
	z.object({
		id: z.uuid(),
		customerId: z.uuid(),
		items: z.array(cartItemResponseSchema),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/cart',
	summary: "Get the authenticated customer's cart",
	description: 'Lazily created on first access. Requires a customer access token.',
	tags: ['Cart'],
	security: customerBearerAuth,
	responses: {
		200: successResponse(cartResponseSchema),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'post',
	path: '/cart/items',
	summary: 'Add a product (or increment it if already in the cart)',
	description:
		'Validates the product is active, the variant (if any) exists, and the resulting quantity does not exceed available stock.',
	tags: ['Cart'],
	security: customerBearerAuth,
	request: {
		body: { content: { 'application/json': { schema: AddCartItemSchema } } },
	},
	responses: {
		200: successResponse(cartResponseSchema),
		401: commonErrorResponses[401],
		404: commonErrorResponses[404],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/cart/items/{productId}',
	summary: 'Set the absolute quantity for a cart line',
	tags: ['Cart'],
	security: customerBearerAuth,
	request: {
		params: z.object({ productId: z.uuid() }),
		body: {
			content: {
				'application/json': { schema: UpdateCartItemQuantitySchema },
			},
		},
	},
	responses: {
		200: successResponse(cartResponseSchema),
		401: commonErrorResponses[401],
		404: commonErrorResponses[404],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/cart/items/{productId}',
	summary: 'Remove one line from the cart',
	description:
		'`variantId` is passed in the body (not the path) to identify which variant line to remove, when the product has variants.',
	tags: ['Cart'],
	security: customerBearerAuth,
	request: {
		params: z.object({ productId: z.uuid() }),
		body: { content: { 'application/json': { schema: RemoveCartItemSchema } } },
	},
	responses: {
		200: successResponse(cartResponseSchema),
		401: commonErrorResponses[401],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/cart',
	summary: 'Empty the cart',
	tags: ['Cart'],
	security: customerBearerAuth,
	responses: {
		200: successResponse(cartResponseSchema),
		401: commonErrorResponses[401],
	},
});
