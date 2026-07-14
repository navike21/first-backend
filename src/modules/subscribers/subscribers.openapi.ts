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
	SubscriberRegisterSchema,
	ListSubscribersQuerySchema,
} from './schemas/subscriber.schema';
import { SubscriberUpdateSchema } from './schemas/subscriber.updateSchema';

const bearerAuth = [{ bearerAuth: [] }];

const subscriberResponseSchema = registry.register(
	'Subscriber',
	z.object({
		id: z.uuid(),
		firstName: z.string(),
		lastName: z.string(),
		contactInformation: z.object({
			email: z.email(),
			phoneNumber: z.string().optional(),
		}),
		location: z
			.object({
				countryCode: z.string().optional(),
				ubigeoCode: z.string().optional(),
				region: z.string().optional(),
				province: z.string().optional(),
				district: z.string().optional(),
				address: z.string().optional(),
				addressNumber: z.string().optional(),
				addressInterior: z.string().optional(),
			})
			.optional(),
		personalInformation: z.object({
			profilePictureUrl: z.url().optional(),
			dateOfBirth: z.iso.datetime().optional(),
			gender: z.string(),
		}),
		status: z.enum(['active', 'inactive']),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'post',
	path: '/subscriber/register',
	summary: 'Register a subscriber (public)',
	description: 'Public subscribe form. Multipart — optional `photo` file part.',
	tags: ['Subscribers'],
	request: { body: multipartWithFile(SubscriberRegisterSchema, ['photo']) },
	responses: {
		201: successResponse(subscriberResponseSchema, 'Subscriber registered'),
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'post',
	path: '/subscriber/register-bulk',
	summary: 'Register multiple subscribers',
	description: 'Requires `subscribers:create` or `:manage`.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: {
		body: {
			content: {
				'application/json': { schema: z.array(SubscriberRegisterSchema) },
			},
		},
	},
	responses: {
		201: successResponse(z.array(subscriberResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/subscriber/trash',
	summary: 'List soft-deleted subscribers',
	description: 'Requires `subscribers:read` or `:manage`.',
	tags: ['Subscribers'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(subscriberResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/subscriber/list',
	summary: 'List subscribers',
	description: 'Requires `subscribers:read` or `:manage`.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: { query: ListSubscribersQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(subscriberResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/subscriber/search/{id}',
	summary: 'Get a subscriber by id',
	description: 'Requires `subscribers:read` or `:manage`.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(subscriberResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/subscriber/restore-bulk',
	summary: 'Restore multiple soft-deleted subscribers',
	description: 'Requires `subscribers:update` or `:manage`.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(subscriberResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/subscriber/restore/{id}',
	summary: 'Restore a soft-deleted subscriber',
	description: 'Requires `subscribers:update` or `:manage`.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(subscriberResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/subscriber/update/{id}',
	summary: 'Update a subscriber',
	description:
		'Requires `subscribers:update` or `:manage`. Multipart — optional `photo` file part.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(SubscriberUpdateSchema, ['photo']),
	},
	responses: {
		200: successResponse(subscriberResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/subscriber/delete-logic-bulk',
	summary: 'Soft-delete multiple subscribers',
	description: 'Requires `subscribers:delete` or `:manage`.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(subscriberResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/subscriber/delete-bulk',
	summary: 'Permanently delete multiple subscribers (from trash only)',
	description: 'Requires `subscribers:purge` — `:manage` does NOT grant this.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(subscriberResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/subscriber/delete-logic/{id}',
	summary: 'Soft-delete a subscriber',
	description: 'Requires `subscribers:delete` or `:manage`.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(subscriberResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/subscriber/delete/{id}',
	summary: 'Permanently delete a subscriber (from trash only)',
	description: 'Requires `subscribers:purge` — `:manage` does NOT grant this.',
	tags: ['Subscribers'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(subscriberResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
