import { z } from 'zod';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
} from '@Config/openapi/responses';
import { EcommerceSettingsUpdateSchema } from './schemas/ecommerceSettings.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const ecommerceSettingsResponseSchema = registry.register(
	'EcommerceSettings',
	z.object({
		currency: z.string(),
		taxPercentage: z.number(),
		storeOriginAddress: z.object({
			country: z.string(),
			ubigeoCode: z.string(),
			region: z.string(),
			province: z.string(),
			district: z.string(),
			address: z.string(),
			addressNumber: z.string(),
			addressInterior: z.string(),
		}),
		checkoutPolicies: localizedString,
	}),
);

registry.registerPath({
	method: 'get',
	path: '/ecommerce-settings/public',
	summary: 'Get the ecommerce settings (public)',
	description:
		'Currency/tax/checkout policies — consumed by a future public storefront to render prices and totals.',
	tags: ['Ecommerce Settings'],
	responses: { 200: successResponse(ecommerceSettingsResponseSchema) },
});

registry.registerPath({
	method: 'get',
	path: '/ecommerce-settings',
	summary: 'Get the ecommerce settings (admin)',
	description: 'Requires `ecommerce-settings:read` or `:manage`.',
	tags: ['Ecommerce Settings'],
	security: bearerAuth,
	responses: {
		200: successResponse(ecommerceSettingsResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/ecommerce-settings',
	summary: 'Update the ecommerce settings',
	description:
		'Requires `ecommerce-settings:update` or `:manage`. Partial update — send only the fields you want to change.',
	tags: ['Ecommerce Settings'],
	security: bearerAuth,
	request: {
		body: {
			content: {
				'application/json': { schema: EcommerceSettingsUpdateSchema },
			},
		},
	},
	responses: {
		200: successResponse(ecommerceSettingsResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});
