import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@Shared/domain/AppError';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';

export function toAppError(err: multer.MulterError): AppError {
	if (err.code === 'LIMIT_FILE_SIZE') {
		return new AppError({
			statusCode: 413,
			code: STORAGE_ERRORS.FILE_SIZE_EXCEEDED,
			message: 'File size exceeds the allowed limit',
		});
	}
	if (err.code === 'LIMIT_FILE_COUNT') {
		return new AppError({
			statusCode: 400,
			code: STORAGE_ERRORS.TOO_MANY_FILES,
			message: 'Too many files uploaded at once',
		});
	}
	return new AppError({
		statusCode: 400,
		code: STORAGE_ERRORS.UPLOAD_FAILED,
		message: err.message,
	});
}

export function createMulterSingle(fieldName: string, maxSizeBytes: number) {
	const upload = multer({
		storage: multer.memoryStorage(),
		limits: { fileSize: maxSizeBytes, files: 1 },
	});

	return (req: Request, res: Response, next: NextFunction) => {
		upload.single(fieldName)(req, res, (err: unknown) => {
			if (err instanceof multer.MulterError) {
				return next(toAppError(err));
			}
			next(err as Error | undefined);
		});
	};
}

export function createMulterArray(
	fieldName: string,
	maxFiles: number,
	maxSizeBytes: number,
) {
	const upload = multer({
		storage: multer.memoryStorage(),
		limits: { fileSize: maxSizeBytes, files: maxFiles },
	});

	return (req: Request, res: Response, next: NextFunction) => {
		upload.array(fieldName, maxFiles)(req, res, (err: unknown) => {
			if (err instanceof multer.MulterError) {
				return next(toAppError(err));
			}
			next(err as Error | undefined);
		});
	};
}
