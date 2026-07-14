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

export type ImageFieldSpec = string | { name: string; maxCount?: number };

function normalizeField(spec: ImageFieldSpec): {
	name: string;
	maxCount: number;
} {
	if (typeof spec === 'string') return { name: spec, maxCount: 1 };
	return { name: spec.name, maxCount: spec.maxCount ?? 1 };
}

/**
 * Composable middleware for endpoints that accept several distinct, optional
 * image fields in one multipart request (e.g. app-settings `logo` + `favicon`,
 * or portfolio's `cover` + several `gallery` files). Each entry defaults to a
 * single file (`maxCount: 1`); pass `{ name, maxCount }` for a field that
 * accepts multiple files. Parses each named field into memory and validates
 * its type by magic bytes. All fields are optional; text fields remain
 * available on `req.body`.
 *
 * Multer populates `req.files` as `{ [field]: Express.Multer.File[] }`.
 */
export function acceptImageFields(
	fieldSpecs: ImageFieldSpec[],
	options: AcceptImageFieldsOptions = {},
): RequestHandler[] {
	const maxSizeBytes = options.maxSizeBytes ?? ENV.STORAGE_MAX_IMAGE_SIZE_BYTES;
	const allowedMimeTypes = options.allowedMimeTypes ?? IMAGE_MIME_TYPES;

	const fields = fieldSpecs.map(normalizeField);
	const totalFiles = fields.reduce((sum, f) => sum + f.maxCount, 0);

	const upload = multer({
		storage: multer.memoryStorage(),
		limits: { fileSize: maxSizeBytes, files: totalFiles },
	});

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
