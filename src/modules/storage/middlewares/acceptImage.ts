import type { RequestHandler } from 'express';
import { ENV } from '@Constants/environments';
import { IMAGE_MIME_TYPES } from '../constants/allowedMimeTypes';
import { createMulterSingle } from './multerUpload';
import { validateFileType } from './validateFileType';

export interface AcceptImageOptions {
	/** Max upload size in bytes. Defaults to ENV.STORAGE_MAX_IMAGE_SIZE_BYTES. */
	maxSizeBytes?: number;
	/** Allowed MIME types. Defaults to images only (raster + SVG). */
	allowedMimeTypes?: readonly string[];
	/** When true, reject the request if no file is present. Defaults to false. */
	required?: boolean;
}

/**
 * Composable middleware for create/update endpoints that accept a single inline
 * image: parses the multipart field into memory and validates the file type by
 * magic bytes. The image is optional by default (non-blocking attachment); text
 * fields (e.g. a `data` JSON part) remain available on `req.body`.
 *
 * Usage: `router.post('/clients', auth, ...acceptImage('logo'), controller)`
 */
export function acceptImage(
	fieldName: string,
	options: AcceptImageOptions = {},
): RequestHandler[] {
	const maxSizeBytes = options.maxSizeBytes ?? ENV.STORAGE_MAX_IMAGE_SIZE_BYTES;
	const allowedMimeTypes = options.allowedMimeTypes ?? IMAGE_MIME_TYPES;

	return [
		createMulterSingle(fieldName, maxSizeBytes),
		validateFileType({
			allowedMimeTypes,
			field: 'file',
			required: options.required ?? false,
		}),
	];
}
