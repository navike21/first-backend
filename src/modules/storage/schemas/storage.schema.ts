import { z } from 'zod';

export const StorageUploadBodySchema = z.object({
	entityType: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'STORAGE_ENTITY_TYPE_REQUIRED'
					: 'STORAGE_ENTITY_TYPE_INVALID',
		})
		.min(1)
		.max(50)
		.regex(/^[a-z-]+$/, { message: 'STORAGE_ENTITY_TYPE_FORMAT' }),
	entityId: z.uuid({ message: 'STORAGE_ENTITY_ID_INVALID' }),
	quality: z.coerce
		.number()
		.int()
		.min(70, { message: 'STORAGE_QUALITY_MIN' })
		.max(100, { message: 'STORAGE_QUALITY_MAX' })
		.optional()
		.default(80),
});

export const StorageDeleteSchema = z.object({
	ids: z
		.array(z.uuid({ message: 'STORAGE_ID_INVALID' }), {
			error: (iss) =>
				iss.input === undefined
					? 'STORAGE_IDS_REQUIRED'
					: 'STORAGE_IDS_INVALID',
		})
		.min(1, { message: 'STORAGE_IDS_MIN' })
		.max(20, { message: 'STORAGE_IDS_MAX' }),
});

export const StorageListQuerySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	limit: z.coerce.number().int().min(1).max(100).optional().default(20),
	status: z.enum(['active', 'inactive'] as const).optional(),
	entityType: z.string().max(50).optional(),
	entityId: z.uuid().optional(),
	uploadedBy: z.uuid().optional(),
	/** Media-library picker filter: image vs video files. */
	kind: z.enum(['image', 'video'] as const).optional(),
	search: z.string().trim().max(200).optional(),
});

export type StorageUploadBody = z.infer<typeof StorageUploadBodySchema>;
export type StorageDeleteBody = z.infer<typeof StorageDeleteSchema>;
export type StorageListQuery = z.infer<typeof StorageListQuerySchema>;
