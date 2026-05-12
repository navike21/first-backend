import type { Request, Response, NextFunction, RequestHandler } from 'express';
import setThrowError from '@Helpers/setThrowError';
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
		setThrowError({
			statusCode: 415,
			code: STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED,
			message: 'File type is not allowed',
		});
	}

	if (declared === 'image/svg+xml') {
		const snippet = file.buffer.toString('utf8', 0, 512);
		if (!snippet.includes('<svg') && !snippet.includes('<?xml')) {
			setThrowError({
				statusCode: 415,
				code: STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED,
				message: 'File content does not match the declared SVG type',
			});
		}
		return;
	}

	const { fromBuffer } = await import('file-type');
	const detected = await fromBuffer(file.buffer);

	if (!detected) {
		setThrowError({
			statusCode: 415,
			code: STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED,
			message: 'Could not determine file type from content',
		});
	}

	if (detected!.mime !== declared) {
		setThrowError({
			statusCode: 415,
			code: STORAGE_ERRORS.MIME_TYPE_MISMATCH,
			message: 'Declared MIME type does not match file content',
		});
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
				setThrowError({
					statusCode: 400,
					code: STORAGE_ERRORS.FILE_REQUIRED,
					message: 'No file was provided',
				});
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
