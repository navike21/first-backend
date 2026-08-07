import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
} from '@Config/openapi/responses';

const customerBearerAuth = [{ customerBearerAuth: [] }];

const wishlistResponseSchema = registry.register(
	'Wishlist',
	z.object({
		id: z.uuid(),
		customerId: z.uuid(),
		productIds: z.array(z.uuid()),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/wishlist',
	summary: "Get the authenticated customer's wishlist",
	description: 'Lazily created on first access. Requires a customer access token.',
	tags: ['Wishlist'],
	security: customerBearerAuth,
	responses: {
		200: successResponse(wishlistResponseSchema),
		401: commonErrorResponses[401],
	},
});

registry.registerPath({
	method: 'post',
	path: '/wishlist/items/{productId}',
	summary: 'Save a product to the wishlist',
	description: 'Idempotent — saving an already-wishlisted product is a no-op.',
	tags: ['Wishlist'],
	security: customerBearerAuth,
	request: { params: z.object({ productId: z.uuid() }) },
	responses: {
		200: successResponse(wishlistResponseSchema),
		401: commonErrorResponses[401],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/wishlist/items/{productId}',
	summary: 'Remove a product from the wishlist',
	tags: ['Wishlist'],
	security: customerBearerAuth,
	request: { params: z.object({ productId: z.uuid() }) },
	responses: {
		200: successResponse(wishlistResponseSchema),
		401: commonErrorResponses[401],
		404: commonErrorResponses[404],
	},
});
