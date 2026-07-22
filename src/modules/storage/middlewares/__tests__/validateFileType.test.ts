import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@Shared/domain/AppError';
import { STORAGE_ERRORS } from '../../domain/errors/StorageErrors';
import { IMAGE_MIME_TYPES } from '../../constants/allowedMimeTypes';

vi.mock('file-type', () => ({
	fromBuffer: vi.fn(),
}));

import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { validateFileType } from '../validateFileType';

function buildFile(
	overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File {
	return {
		fieldname: 'file',
		originalname: 'photo.jpg',
		encoding: '7bit',
		mimetype: 'image/jpeg',
		size: 1024,
		buffer: Buffer.from('JFIF'),
		stream: null as never,
		destination: '',
		filename: '',
		path: '',
		...overrides,
	};
}

function buildReq(
	file?: Express.Multer.File,
	files?: Express.Multer.File[],
): Partial<Request> {
	return { file, files: files as Request['files'] };
}

function runMiddleware(
	req: Partial<Request>,
	options: Parameters<typeof validateFileType>[0],
): Promise<void> {
	return new Promise((resolve, reject) => {
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		validateFileType(options)(req as Request, {} as Response, next);
	});
}

describe('validateFileType', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('throws FILE_REQUIRED when no file is present', async () => {
		const req = buildReq(undefined);
		await expect(
			runMiddleware(req, { allowedMimeTypes: IMAGE_MIME_TYPES }),
		).rejects.toMatchObject({ code: STORAGE_ERRORS.FILE_REQUIRED });
	});

	it('passes through when no file is present and required is false', async () => {
		const req = buildReq(undefined);
		await expect(
			runMiddleware(req, {
				allowedMimeTypes: IMAGE_MIME_TYPES,
				required: false,
			}),
		).resolves.toBeUndefined();
	});

	it('throws FILE_TYPE_NOT_ALLOWED when declared MIME is not in allowed list', async () => {
		const req = buildReq(buildFile({ mimetype: 'image/gif' }));
		await expect(
			runMiddleware(req, { allowedMimeTypes: IMAGE_MIME_TYPES }),
		).rejects.toMatchObject({ code: STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED });
	});

	it('accepts a valid SVG by content check (<svg>)', async () => {
		const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
		const req = buildReq(
			buildFile({
				mimetype: 'image/svg+xml',
				buffer: Buffer.from(svgContent),
			}),
		);
		await expect(
			runMiddleware(req, { allowedMimeTypes: [...IMAGE_MIME_TYPES] }),
		).resolves.toBeUndefined();
	});

	it('accepts a valid SVG by content check (<?xml)', async () => {
		const svgContent =
			'<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"></svg>';
		const req = buildReq(
			buildFile({
				mimetype: 'image/svg+xml',
				buffer: Buffer.from(svgContent),
			}),
		);
		await expect(
			runMiddleware(req, { allowedMimeTypes: [...IMAGE_MIME_TYPES] }),
		).resolves.toBeUndefined();
	});

	it('throws FILE_TYPE_NOT_ALLOWED for SVG with invalid content', async () => {
		const req = buildReq(
			buildFile({
				mimetype: 'image/svg+xml',
				buffer: Buffer.from('not svg content at all'),
			}),
		);
		await expect(
			runMiddleware(req, { allowedMimeTypes: [...IMAGE_MIME_TYPES] }),
		).rejects.toMatchObject({ code: STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED });
	});

	it('throws FILE_TYPE_NOT_ALLOWED when file-type cannot detect the binary format', async () => {
		vi.mocked(fileTypeFromBuffer).mockResolvedValue(undefined);
		const req = buildReq(buildFile({ mimetype: 'image/jpeg' }));
		await expect(
			runMiddleware(req, { allowedMimeTypes: IMAGE_MIME_TYPES }),
		).rejects.toMatchObject({ code: STORAGE_ERRORS.FILE_TYPE_NOT_ALLOWED });
	});

	it('throws MIME_TYPE_MISMATCH when detected type differs from declared', async () => {
		vi.mocked(fileTypeFromBuffer).mockResolvedValue({
			mime: 'image/png',
			ext: 'png',
		});
		const req = buildReq(buildFile({ mimetype: 'image/jpeg' }));
		await expect(
			runMiddleware(req, { allowedMimeTypes: IMAGE_MIME_TYPES }),
		).rejects.toMatchObject({ code: STORAGE_ERRORS.MIME_TYPE_MISMATCH });
	});

	it('passes through when detected type matches declared type', async () => {
		vi.mocked(fileTypeFromBuffer).mockResolvedValue({
			mime: 'image/jpeg',
			ext: 'jpg',
		});
		const req = buildReq(buildFile({ mimetype: 'image/jpeg' }));
		await expect(
			runMiddleware(req, { allowedMimeTypes: IMAGE_MIME_TYPES }),
		).resolves.toBeUndefined();
	});

	describe('field: files (bulk)', () => {
		it('throws FILE_REQUIRED when files array is empty', async () => {
			const req = buildReq(undefined, []);
			await expect(
				runMiddleware(req, {
					allowedMimeTypes: IMAGE_MIME_TYPES,
					field: 'files',
				}),
			).rejects.toMatchObject({ code: STORAGE_ERRORS.FILE_REQUIRED });
		});

		it('throws FILE_REQUIRED when req.files is undefined (covers ?? [] branch)', async () => {
			const req: Partial<Request> = { file: undefined, files: undefined };
			await expect(
				runMiddleware(req, {
					allowedMimeTypes: IMAGE_MIME_TYPES,
					field: 'files',
				}),
			).rejects.toMatchObject({ code: STORAGE_ERRORS.FILE_REQUIRED });
		});

		it('validates all files in the array', async () => {
			vi.mocked(fileTypeFromBuffer).mockResolvedValue({
				mime: 'image/jpeg',
				ext: 'jpg',
			});
			const files = [
				buildFile({ mimetype: 'image/jpeg' }),
				buildFile({ mimetype: 'image/jpeg' }),
			];
			const req = buildReq(undefined, files);
			await expect(
				runMiddleware(req, {
					allowedMimeTypes: IMAGE_MIME_TYPES,
					field: 'files',
				}),
			).resolves.toBeUndefined();
		});

		it('throws on the first invalid file in the array', async () => {
			vi.mocked(fileTypeFromBuffer).mockResolvedValue({
				mime: 'image/jpeg',
				ext: 'jpg',
			});
			const files = [
				buildFile({ mimetype: 'image/jpeg' }),
				buildFile({ mimetype: 'image/gif' }),
			];
			const req = buildReq(undefined, files);
			await expect(
				runMiddleware(req, {
					allowedMimeTypes: IMAGE_MIME_TYPES,
					field: 'files',
				}),
			).rejects.toBeInstanceOf(AppError);
		});
	});
});
