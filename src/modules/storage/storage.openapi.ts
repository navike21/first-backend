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
	StorageDeleteSchema,
	StorageListQuerySchema,
} from './schemas/storage.schema';

const bearerAuth = [{ bearerAuth: [] }];

const variantSchema = z.object({ pathname: z.string(), url: z.url() });

const storageFileResponseSchema = registry.register(
	'StorageFile',
	z.object({
		id: z.uuid(),
		entityType: z.string(),
		entityId: z.uuid(),
		field: z.string().optional(),
		originalName: z.string(),
		mimeType: z.string(),
		size: z.number(),
		isImage: z.boolean(),
		original: variantSchema,
		full: variantSchema.optional(),
		thumb: variantSchema.optional(),
		uploadedBy: z.uuid().optional(),
		status: z.enum(['active', 'inactive']),
		deletedAt: z.iso.datetime().nullable().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

const storageUsageSchema = z.object({
	module: z.enum([
		'clients',
		'users',
		'collaborators',
		'portfolio',
		'services',
		'pages',
		'app-settings',
	]),
	id: z.uuid(),
	label: z.string(),
	context: z
		.enum(['cover', 'gallery', 'ogImage', 'background', 'logo', 'favicon'])
		.optional(),
});

registry.registerPath({
	method: 'post',
	path: '/storage/editor-image',
	summary: 'Upload one image from a rich-text editor',
	description:
		'Requires `storage:upload` or `:manage`. Multipart — required `image` file part. Used by RichTextArea to resolve base64 images on save.',
	tags: ['Storage'],
	security: bearerAuth,
	request: {
		body: {
			content: {
				'multipart/form-data': {
					schema: z.object({
						image: z.string().openapi({ type: 'string', format: 'binary' }),
					}),
				},
			},
			required: true,
		},
	},
	responses: {
		200: successResponse(storageFileResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'post',
	path: '/storage/direct-upload',
	summary:
		'Vercel Blob client-upload handshake (token request + completion webhook)',
	description:
		"Serves two callers on the same route: the authenticated browser requesting a client upload token (checked internally, not via `authenticate` middleware), and Vercel Blob's own upload-completed webhook callback. Response body is `@vercel/blob/client`'s own shape (`{clientToken}` / `{response:'ok'}`), NOT this API's standard envelope.",
	tags: ['Storage'],
	responses: {
		200: {
			description:
				'Vercel Blob client-upload protocol response (see @vercel/blob/client)',
		},
	},
});

registry.registerPath({
	method: 'post',
	path: '/storage/{id}/cover',
	summary: 'Attach a generated cover image to a video file',
	description:
		'Requires `storage:upload` or `:manage`. Multipart — required `cover` file part (browser-captured video frame).',
	tags: ['Storage'],
	security: bearerAuth,
	request: {
		params: z.object({ id: z.uuid() }),
		body: {
			content: {
				'multipart/form-data': {
					schema: z.object({
						cover: z.string().openapi({ type: 'string', format: 'binary' }),
					}),
				},
			},
			required: true,
		},
	},
	responses: {
		200: successResponse(storageFileResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'post',
	path: '/storage/upload',
	summary:
		'Upload one file directly (standalone, not tied to a create/update form)',
	description:
		'Requires `storage:upload` or `:manage`. Multipart — required `file` part.',
	tags: ['Storage'],
	security: bearerAuth,
	request: {
		body: {
			content: {
				'multipart/form-data': {
					schema: z.object({
						file: z.string().openapi({ type: 'string', format: 'binary' }),
						entityType: z.string(),
						entityId: z.uuid(),
						quality: z.number().int().min(70).max(100).optional(),
					}),
				},
			},
			required: true,
		},
	},
	responses: {
		200: successResponse(storageFileResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'post',
	path: '/storage/upload-bulk',
	summary: 'Upload multiple files directly',
	description:
		'Requires `storage:upload` or `:manage`. Multipart — `files` (multiple parts).',
	tags: ['Storage'],
	security: bearerAuth,
	request: {
		body: {
			content: {
				'multipart/form-data': {
					schema: z.object({
						files: z.array(
							z.string().openapi({ type: 'string', format: 'binary' }),
						),
						entityType: z.string(),
						entityId: z.uuid(),
						quality: z.number().int().min(70).max(100).optional(),
					}),
				},
			},
			required: true,
		},
	},
	responses: {
		200: successResponse(z.array(storageFileResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
	},
});

registry.registerPath({
	method: 'get',
	path: '/storage/trash',
	summary: 'List soft-deleted files',
	description: 'Requires `storage:read` or `:manage`.',
	tags: ['Storage'],
	security: bearerAuth,
	responses: {
		200: successResponse(
			z.object({
				data: z.array(storageFileResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/storage/files',
	summary: 'List files (media library)',
	description: 'Requires `storage:read` or `:manage`.',
	tags: ['Storage'],
	security: bearerAuth,
	request: { query: StorageListQuerySchema },
	responses: {
		200: successResponse(
			z.object({
				data: z.array(storageFileResponseSchema),
				meta: paginationMetaSchema,
			}),
		),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/storage/{id}/usages',
	summary: 'Find where a file is currently referenced',
	description:
		'Requires `storage:read` or `:manage`. Used before delete to warn about in-use files.',
	tags: ['Storage'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(z.array(storageUsageSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/storage/{id}/restore',
	summary: 'Restore a soft-deleted file',
	description: 'Requires `storage:update` or `:manage`.',
	tags: ['Storage'],
	security: bearerAuth,
	request: { params: z.object({ id: z.uuid() }) },
	responses: {
		200: successResponse(storageFileResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		404: commonErrorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/storage/bulk/restore',
	summary: 'Restore multiple soft-deleted files',
	description: 'Requires `storage:update` or `:manage`.',
	tags: ['Storage'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: bulkIdsRequestSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(storageFileResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/storage/delete/permanent',
	summary: 'Permanently delete multiple files (from trash only)',
	description: 'Requires `storage:purge` — `:manage` does NOT grant this.',
	tags: ['Storage'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: StorageDeleteSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(storageFileResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/storage/delete',
	summary: 'Soft-delete multiple files',
	description: 'Requires `storage:delete` or `:manage`.',
	tags: ['Storage'],
	security: bearerAuth,
	request: {
		body: { content: { 'application/json': { schema: StorageDeleteSchema } } },
	},
	responses: {
		200: successResponse(bulkResultSchema(storageFileResponseSchema)),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
	},
});
