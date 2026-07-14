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
	CreatePageSchema,
	UpdatePageSchema,
	CreateSectionSchema,
	UpdateSectionSchema,
	ReorderSectionsSchema,
	ReplaceSectionsSchema,
	ListPagesQuerySchema,
	ResolvePageQuerySchema,
} from './schemas/page.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

const sectionSchema = z.object({
	sectionId: z.uuid(),
	type: z.string(),
	order: z.number(),
	settings: z.record(z.string(), z.unknown()).optional(),
	content: z.record(z.string(), z.unknown()),
});

const pageResponseSchema = registry.register(
	'Page',
	z.object({
		id: z.uuid(),
		slug: localizedString,
		title: localizedString,
		description: localizedString.optional(),
		coverImageUrl: z.url().optional(),
		parentId: z.uuid().optional(),
		status: z.enum(['draft', 'scheduled', 'published']),
		scheduledAt: z.iso.datetime().optional(),
		categoryIds: z.array(z.uuid()),
		tagIds: z.array(z.uuid()),
		sections: z.array(sectionSchema),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

registry.registerPath({
	method: 'get',
	path: '/pages',
	summary: 'List published pages (public)',
	tags: ['Pages'],
	responses: {
		200: successResponse(
			z.object({
				data: z.array(pageResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
	},
});

registry.registerPath({
	method: 'get',
	path: '/pages/resolve',
	summary: 'Resolve a published page by its public path (public)',
	description:
		'Used by the public site to render a page from its URL path (per-language slugs).',
	tags: ['Pages'],
	request: { query: ResolvePageQuerySchema },
	responses: {
		200: successResponse(pageResponseSchema),
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'get',
	path: '/pages/trash',
	summary: 'List soft-deleted pages',
	description: 'Requires `pages:read` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(pageResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/pages/admin',
	summary: 'List pages (admin — includes draft/scheduled)',
	description: 'Requires `pages:read` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { query: ListPagesQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(pageResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/pages/bulk',
	summary: 'Soft-delete multiple pages',
	description: 'Requires `pages:delete` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(pageResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/pages/bulk/restore',
	summary: 'Restore multiple soft-deleted pages',
	description: 'Requires `pages:update` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(pageResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/pages/bulk/permanent',
	summary: 'Permanently delete multiple pages (from trash only)',
	description: 'Requires `pages:purge` — `:manage` does NOT grant this.',
	tags: ['Pages'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(pageResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/pages/{id}/revisions',
	summary: 'List revisions of a page',
	description:
		'Requires `pages:read` or `:manage`. Created automatically on every full section replace.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(
			z.array(
				z.object({
					id: z.uuid(),
					createdAt: z.iso.datetime(),
					sections: z.array(sectionSchema),
				}),
			),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/pages/{id}/revisions/{revisionId}/restore',
	summary: 'Restore a page to a previous revision',
	description:
		'Requires `pages:update` or `:manage`. Snapshots the current state as a new revision first.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid(), revisionId: z.uuid() }) },
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'get',
	path: '/pages/{id}',
	summary: 'Get a page by id (admin)',
	description: 'Requires `pages:read` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/pages',
	summary: 'Create a page',
	description:
		'Requires `pages:create` or `:manage`. Multipart — optional `cover`/`ogImage` file parts.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { body: multipartWithFile(CreatePageSchema, ['cover', 'ogImage']) },
	responses: {
		201: successResponse(pageResponseSchema, 'Page created'),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/pages/{id}/restore',
	summary: 'Restore a soft-deleted page',
	description: 'Requires `pages:update` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/pages/{id}',
	summary: 'Update page metadata (not its sections)',
	description:
		'Requires `pages:update` or `:manage`. Multipart — optional `cover`/`ogImage` file parts.',
	tags: ['Pages'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(UpdatePageSchema, ['cover', 'ogImage']),
	},
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/pages/{id}/permanent',
	summary: 'Permanently delete a page (from trash only)',
	description: 'Requires `pages:purge` — `:manage` does NOT grant this.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/pages/{id}',
	summary: 'Soft-delete a page',
	description: 'Requires `pages:delete` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/pages/{id}/sections',
	summary: 'Add one section to a page',
	description:
		'Requires `pages:update` or `:manage`. Granular add — see PUT for the visual builder’s full-replace save.',
	tags: ['Pages'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: { content: { 'application/json': { schema: CreateSectionSchema } } },
	},
	responses: {
		201: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'put',
	path: '/pages/{id}/sections/reorder',
	summary: 'Reorder a page’s sections',
	description: 'Requires `pages:update` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: { 'application/json': { schema: ReorderSectionsSchema } },
		},
	},
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'put',
	path: '/pages/{id}/sections',
	summary: 'Replace all of a page’s sections (visual builder save)',
	description:
		'Requires `pages:update` or `:manage`. One PUT per save from the visual builder — creates a page revision first. `content` HTML sub-fields (text widget body, accordion answers) are sanitized server-side.',
	tags: ['Pages'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: { 'application/json': { schema: ReplaceSectionsSchema } },
		},
	},
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/pages/{id}/sections/{sectionId}',
	summary: 'Update one section',
	description: 'Requires `pages:update` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid(), sectionId: z.uuid() }),
		body: { content: { 'application/json': { schema: UpdateSectionSchema } } },
	},
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/pages/{id}/sections/{sectionId}',
	summary: 'Delete one section',
	description: 'Requires `pages:delete` or `:manage`.',
	tags: ['Pages'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid(), sectionId: z.uuid() }) },
	responses: {
		200: successResponse(pageResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});
