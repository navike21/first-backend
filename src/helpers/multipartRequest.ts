import type { Request } from 'express';
import { AppError } from '@Shared/domain/AppError';
import type { IncomingFile } from '@Types/incomingFile';

/**
 * Returns the payload for create/update endpoints that accept an inline file.
 * The request may arrive either as multipart (a `data` JSON part alongside the
 * file) or as plain JSON. In the multipart case `data` is parsed; otherwise the
 * already-parsed JSON body is returned as-is.
 */
export function parseRequestData(req: Request): unknown {
	const raw = (req.body as Record<string, unknown> | undefined)?.data;
	if (typeof raw === 'string') {
		try {
			return JSON.parse(raw);
		} catch {
			AppError.badRequest(
				'ERROR_INVALID_BODY',
				'The "data" field must contain valid JSON',
			);
		}
	}
	return req.body;
}

/** Maps the multer-populated `req.file` into a framework-agnostic IncomingFile. */
export function getUploadedFile(req: Request): IncomingFile | undefined {
	if (!req.file) return undefined;
	return {
		buffer: req.file.buffer,
		originalName: req.file.originalname,
		mimeType: req.file.mimetype,
	};
}

/**
 * Maps a named field from a multi-field multipart upload (`req.files` shaped as
 * `{ [field]: File[] }`, populated by `acceptImageFields`) into an IncomingFile.
 */
export function getUploadedFileField(
	req: Request,
	name: string,
): IncomingFile | undefined {
	const files = req.files as Record<string, Express.Multer.File[]> | undefined;
	const file = files?.[name]?.[0];
	if (!file) return undefined;
	return {
		buffer: file.buffer,
		originalName: file.originalname,
		mimeType: file.mimetype,
	};
}

/**
 * Maps every file under a named field from a multi-field multipart upload
 * (`req.files` shaped as `{ [field]: File[] }`, populated by
 * `acceptImageFields` with a `maxCount > 1`) into IncomingFiles, in the order
 * they were sent.
 */
export function getUploadedFileArray(
	req: Request,
	name: string,
): IncomingFile[] {
	const files = req.files as Record<string, Express.Multer.File[]> | undefined;
	const group = files?.[name] ?? [];
	return group.map((file) => ({
		buffer: file.buffer,
		originalName: file.originalname,
		mimeType: file.mimetype,
	}));
}
