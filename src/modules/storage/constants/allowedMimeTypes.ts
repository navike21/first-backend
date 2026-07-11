export const RASTER_IMAGE_MIME_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
] as const;

export const VECTOR_IMAGE_MIME_TYPES = ['image/svg+xml'] as const;

export const IMAGE_MIME_TYPES = [
	...RASTER_IMAGE_MIME_TYPES,
	...VECTOR_IMAGE_MIME_TYPES,
] as const;

export const DOCUMENT_MIME_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

// Only reachable via direct browser-to-storage upload (application/directUpload.ts),
// never through the multer/Express body pipeline — kept separate from
// ALL_ALLOWED_MIME_TYPES on purpose (that list gates the multer-based routes).
export const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm'] as const;

export const ALL_ALLOWED_MIME_TYPES = [
	...IMAGE_MIME_TYPES,
	...DOCUMENT_MIME_TYPES,
] as const;

export type AllowedMimeType = (typeof ALL_ALLOWED_MIME_TYPES)[number];
export type RasterMimeType = (typeof RASTER_IMAGE_MIME_TYPES)[number];

export function isRasterImage(mimeType: string): boolean {
	return (RASTER_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function isSvg(mimeType: string): boolean {
	return mimeType === 'image/svg+xml';
}

export function isImageMimeType(mimeType: string): boolean {
	return (IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}
