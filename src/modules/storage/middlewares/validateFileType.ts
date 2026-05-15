import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '@Shared/domain/AppError';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';

export interface ValidateFileTypeOptions {
	allowedMimeTypes: readonly string[];
	field?: 'file' | 'files';
}

async function validateSingleFile(
	file: Express.Multer.File,
	allowedMimeTypes: readonly string[],
): Promise<void> {
	const declared = file.mimetype;

	if (!allowedMimeTypes.includes(declared)) {
		AppError.unsupportedMediaType(STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED, 'File type is not allowed');
	}

	if (declared === 'image/svg+xml') {
		const snippet = file.buffer.toString('utf8', 0, 512);
		if (!snippet.includes('<svg') && !snippet.includes('<?xml')) {
			AppError.unsupportedMediaType(STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED, 'File content does not match the declared SVG type');
		}
		return;
	}

	const { fromBuffer } = await import('file-type');
	const detected = await fromBuffer(file.buffer);

	if (!detected) {
		AppError.unsupportedMediaType(STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED, 'Could not determine file type from content');
	}

	if (detected.mime !== declared) {
		AppError.unsupportedMediaType(STORAGE_ERRORS.MIME_TYPE_MISMATCH, 'Declared MIME type does not match file content');
	}
}

export function validateFileType(
	options: ValidateFileTypeOptions,
): RequestHandler {
	const field = options.field ?? 'file';

	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			let files: Express.Multer.File[];
			if (field === 'files') {
				files = (req.files as Express.Multer.File[]) ?? [];
			} else {
				files = req.file ? [req.file] : [];
			}

			if (files.length === 0) {
				AppError.badRequest(STORAGE_ERRORS.FILE_REQUIRED, 'No file was provided');
			}

			for (const file of files) {
				await validateSingleFile(file, options.allowedMimeTypes);
			}

			next();
		} catch (err) {
			next(err);
		}
	};
}
