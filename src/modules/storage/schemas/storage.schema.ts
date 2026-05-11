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
	urls: z
		.array(z.url({ message: 'STORAGE_URL_INVALID' }), {
			error: (iss) =>
				iss.input === undefined
					? 'STORAGE_URLS_REQUIRED'
					: 'STORAGE_URLS_INVALID',
		})
		.min(1, { message: 'STORAGE_URLS_MIN' })
		.max(20, { message: 'STORAGE_URLS_MAX' }),
});

export type StorageUploadBody = z.infer<typeof StorageUploadBodySchema>;
export type StorageDeleteBody = z.infer<typeof StorageDeleteSchema>;
