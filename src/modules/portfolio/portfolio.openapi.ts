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
	CreatePortfolioSchema,
	UpdatePortfolioSchema,
	ListPortfolioQuerySchema,
} from './schemas/portfolio.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const portfolioResponseSchema = registry.register(
	'Portfolio',
	z.object({
		id: z.uuid(),
		slug: z.string(),
		name: localizedString,
		shortDescription: localizedString,
		description: localizedString,
		coverImageUrl: z.url().optional(),
		gallery: z.array(z.url()),
		clientId: z.uuid().optional(),
		serviceIds: z.array(z.uuid()),
		technologies: z.array(z.string()),
		projectUrl: z.url().optional(),
		startDate: z.iso.date(),
		endDate: z.iso.date().optional(),
		featured: z.boolean(),
		order: z.number(),
		status: z.enum(['draft', 'published', 'archived']),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/portfolio',
	summary: 'List published portfolio items (public)',
	tags: ['Portfolio'],
	request: { query: ListPortfolioQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(portfolioResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
	},
});

registry.registerPath({
	method: 'get',
	path: '/portfolio/admin',
	summary: 'List portfolio items (admin — includes drafts/archived)',
	description: 'Requires `portfolio:read` or `:manage`.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: { query: ListPortfolioQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(portfolioResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/portfolio/trash',
	summary: 'List soft-deleted portfolio items',
	description: 'Requires `portfolio:read` or `:manage`.',
	tags: ['Portfolio'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(portfolioResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/portfolio/id/{id}',
	summary: 'Get a portfolio item by id (admin)',
	description: 'Requires `portfolio:read` or `:manage`.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(portfolioResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'get',
	path: '/portfolio/by-service/{serviceSlug}',
	summary: 'List published portfolio items for a given service (public)',
	tags: ['Portfolio'],
	request: { params: z.object({ serviceSlug: z.string() }) },
	responses: { 200: successResponse(z.array(portfolioResponseSchema)) },
});

registry.registerPath({
	method: 'get',
	path: '/portfolio/{slug}',
	summary: 'Get a published portfolio item by slug (public)',
	tags: ['Portfolio'],
	request: { params: z.object({ slug: z.string() }) },
	responses: {
		200: successResponse(portfolioResponseSchema),
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/portfolio/bulk',
	summary: 'Soft-delete multiple portfolio items',
	description: 'Requires `portfolio:delete` or `:manage`.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(portfolioResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/portfolio/bulk/restore',
	summary: 'Restore multiple soft-deleted portfolio items',
	description: 'Requires `portfolio:update` or `:manage`.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(portfolioResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/portfolio/bulk/permanent',
	summary: 'Permanently delete multiple portfolio items (from trash only)',
	description: 'Requires `portfolio:purge` — `:manage` does NOT grant this.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(portfolioResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'post',
	path: '/portfolio',
	summary: 'Create a portfolio item',
	description:
		'Requires `portfolio:create` or `:manage`. Multipart — `cover` file part (or `coverImageUrl` in `data`) required; up to 10 `gallery` file parts.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: {
		body: multipartWithFile(CreatePortfolioSchema, ['cover', 'gallery']),
	},
	responses: {
		201: successResponse(portfolioResponseSchema, 'Portfolio item created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/portfolio/{id}/restore',
	summary: 'Restore a soft-deleted portfolio item',
	description: 'Requires `portfolio:update` or `:manage`.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(portfolioResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/portfolio/{id}',
	summary: 'Update a portfolio item',
	description:
		'Requires `portfolio:update` or `:manage`. Multipart — optional `cover`/`gallery` file parts + `galleryOrder` in `data` to reconcile gallery order.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(UpdatePortfolioSchema, ['cover', 'gallery']),
	},
	responses: {
		200: successResponse(portfolioResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/portfolio/{id}/permanent',
	summary: 'Permanently delete a portfolio item (from trash only)',
	description: 'Requires `portfolio:purge` — `:manage` does NOT grant this.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(portfolioResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/portfolio/{id}',
	summary: 'Soft-delete a portfolio item',
	description: 'Requires `portfolio:delete` or `:manage`.',
	tags: ['Portfolio'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(portfolioResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
