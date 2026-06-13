import multer from 'multer';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ENV } from '@Constants/environments';
import { IMAGE_MIME_TYPES } from '../constants/allowedMimeTypes';
import { toAppError } from './multerUpload';
import { validateSingleFile } from './validateFileType';

export interface AcceptImageFieldsOptions {
	maxSizeBytes?: number;
	allowedMimeTypes?: readonly string[];
}

/**
 * Composable middleware for endpoints that accept several distinct, optional
 * image fields in one multipart request (e.g. app-settings `logo` + `favicon`).
 * Parses each named field into memory and validates its type by magic bytes.
 * All fields are optional; text fields remain available on `req.body`.
 *
 * Multer populates `req.files` as `{ [field]: Express.Multer.File[] }`.
 */
export function acceptImageFields(
	fieldNames: string[],
	options: AcceptImageFieldsOptions = {},
): RequestHandler[] {
	const maxSizeBytes = options.maxSizeBytes ?? ENV.STORAGE_MAX_IMAGE_SIZE_BYTES;
	const allowedMimeTypes = options.allowedMimeTypes ?? IMAGE_MIME_TYPES;

	const upload = multer({
		storage: multer.memoryStorage(),
		limits: { fileSize: maxSizeBytes, files: fieldNames.length },
	});
	const fields = fieldNames.map((name) => ({ name, maxCount: 1 }));

	const parse: RequestHandler = (req, res, next) => {
		upload.fields(fields)(req, res, (err: unknown) => {
			if (err instanceof multer.MulterError) return next(toAppError(err));
			next(err as Error | undefined);
		});
	};

	const validate = async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const files = req.files as
				| Record<string, Express.Multer.File[]>
				| undefined;
			if (files) {
				for (const group of Object.values(files)) {
					for (const file of group) {
						await validateSingleFile(file, allowedMimeTypes);
					}
				}
			}
			next();
		} catch (err) {
			next(err);
		}
	};

	return [parse, validate];
}
