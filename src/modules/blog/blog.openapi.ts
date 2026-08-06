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
	CreateBlogSchema,
	UpdateBlogSchema,
	ListBlogQuerySchema,
} from './schemas/blog.schema';

const bearerAuth = [{ bearerAuth: [] }];
const localizedString = z.record(z.string(), z.string());

// Shared response-shape fragments — every admin route needs 401/403, most
// single-item admin routes also need 404; reused across registerPath calls
// below instead of repeating the same literal object each time.
const authErrors = {
	401: commonErrorResponses[401],
	403: commonErrorResponses[403],
};
const authErrorsWithNotFound = { ...authErrors, 404: commonErrorResponses[404] };
const bulkIdsBody = {
	body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
};

const blogSeoResponseSchema = z.object({
	metaTitle: localizedString.optional(),
	metaDescription: localizedString.optional(),
	keywords: localizedString.optional(),
	ogImage: z.url().optional(),
});

const blogResponseSchema = registry.register(
	'BlogPost',
	z.object({
		id: z.uuid(),
		slug: localizedString,
		title: localizedString,
		excerpt: localizedString.optional(),
		content: localizedString,
		coverImageUrl: z.url().optional(),
		categoryIds: z.array(z.uuid()),
		tagIds: z.array(z.uuid()),
		authorId: z.uuid().optional(),
		seo: blogSeoResponseSchema,
		status: z.enum(['draft', 'scheduled', 'published']),
		scheduledAt: z.iso.datetime().optional(),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

const blogListResponseSchema = z.object({
	data: z.array(blogResponseSchema),
	meta: paginationMetaSchema,
});
const blogBulkResultResponse = successResponse(bulkResultSchema(blogResponseSchema));

registry.registerPath({
	method: 'get',
	path: '/blog',
	summary: 'List published blog posts (public)',
	tags: ['Blog'],
	request: { query: ListBlogQuerySchema },
	responses: { 200: successResponse(blogListResponseSchema) },
});

registry.registerPath({
	method: 'get',
	path: '/blog/admin',
	summary: 'List blog posts (admin — includes drafts/scheduled)',
	description: 'Requires `blog:read` or `:manage`.',
	tags: ['Blog'],
	security: bearerAuth,
	request: { query: ListBlogQuerySchema },
	responses: { 200: successResponse(blogListResponseSchema), ...authErrors },
});

registry.registerPath({
	method: 'get',
	path: '/blog/trash',
	summary: 'List soft-deleted blog posts',
	description: 'Requires `blog:read` or `:manage`.',
	tags: ['Blog'],
	security: bearerAuth,
	responses: { 200: successResponse(blogListResponseSchema), ...authErrors },
});

registry.registerPath({
	method: 'get',
	path: '/blog/id/{id}',
	summary: 'Get a blog post by id (admin)',
	description: 'Requires `blog:read` or `:manage`.',
	tags: ['Blog'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(blogResponseSchema),
		...authErrorsWithNotFound,
	},
});

registry.registerPath({
	method: 'get',
	path: '/blog/{slug}',
	summary: 'Get a published blog post by slug (public)',
	tags: ['Blog'],
	request: { params: z.object({ slug: z.string() }) },
	responses: {
		200: successResponse(blogResponseSchema),
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/blog/bulk',
	summary: 'Soft-delete multiple blog posts',
	description: 'Requires `blog:delete` or `:manage`.',
	tags: ['Blog'],
	security: bearerAuth,
	request: bulkIdsBody,
	responses: { 200: blogBulkResultResponse, ...authErrors },
});

registry.registerPath({
	method: 'patch',
	path: '/blog/bulk/restore',
	summary: 'Restore multiple soft-deleted blog posts',
	description: 'Requires `blog:update` or `:manage`.',
	tags: ['Blog'],
	security: bearerAuth,
	request: bulkIdsBody,
	responses: { 200: blogBulkResultResponse, ...authErrors },
});

registry.registerPath({
	method: 'delete',
	path: '/blog/bulk/permanent',
	summary: 'Permanently delete multiple blog posts (from trash only)',
	description: 'Requires `blog:purge` — `:manage` does NOT grant this.',
	tags: ['Blog'],
	security: bearerAuth,
	request: bulkIdsBody,
	responses: { 200: blogBulkResultResponse, ...authErrors },
});

registry.registerPath({
	method: 'post',
	path: '/blog',
	summary: 'Create a blog post',
	description:
		'Requires `blog:create` or `:manage`. Multipart — `cover` file part (or `coverImageUrl` in `data`) required; optional `ogImage` file part.',
	tags: ['Blog'],
	security: bearerAuth,
	request: { body: multipartWithFile(CreateBlogSchema, ['cover', 'ogImage']) },
	responses: {
		201: successResponse(blogResponseSchema, 'Blog post created'),
		...authErrors,
		409: commonErrorResponses[409],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/blog/{id}/restore',
	summary: 'Restore a soft-deleted blog post',
	description: 'Requires `blog:update` or `:manage`.',
	tags: ['Blog'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(blogResponseSchema),
		...authErrorsWithNotFound,
	},
});

registry.registerPath({
	method: 'patch',
	path: '/blog/{id}',
	summary: 'Update a blog post',
	description:
		'Requires `blog:update` or `:manage`. Multipart — optional `cover`/`ogImage` file parts.',
	tags: ['Blog'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: multipartWithFile(UpdateBlogSchema, ['cover', 'ogImage']),
	},
	responses: {
		200: successResponse(blogResponseSchema),
		...authErrorsWithNotFound,
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/blog/{id}/permanent',
	summary: 'Permanently delete a blog post (from trash only)',
	description: 'Requires `blog:purge` — `:manage` does NOT grant this.',
	tags: ['Blog'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(blogResponseSchema),
		...authErrorsWithNotFound,
	},
});

registry.registerPath({
	method: 'delete',
	path: '/blog/{id}',
	summary: 'Soft-delete a blog post',
	description: 'Requires `blog:delete` or `:manage`.',
	tags: ['Blog'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(blogResponseSchema),
		...authErrorsWithNotFound,
	},
});
