import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { STORAGE_ERRORS } from '../../domain/errors/StorageErrors';

const { mockSingle, mockArray, FakeMulterError, multerFn } = vi.hoisted(() => {
	class FakeMulterError extends Error {
		constructor(public code: string) {
			super(code);
			this.name = 'MulterError';
		}
	}

	const mockSingle = vi.fn();
	const mockArray = vi.fn();
	const mockMemoryStorage = vi.fn(() => ({}));
	const multerInstance = { single: mockSingle, array: mockArray };
	const multerFn = Object.assign(
		vi.fn(() => multerInstance),
		{
			memoryStorage: mockMemoryStorage,
			MulterError: FakeMulterError,
		},
	);

	return { mockSingle, mockArray, FakeMulterError, multerFn };
});

vi.mock('multer', () => ({ default: multerFn }));

import { createMulterSingle, createMulterArray } from '../multerUpload';

function makeInner(cb: (err?: unknown) => void) {
	return vi.fn(
		(_req: Request, _res: Response, next: (err?: unknown) => void) => {
			cb(next);
		},
	);
}

function run(
	handler: (req: Request, res: Response, next: NextFunction) => void,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		handler({} as Request, {} as Response, next);
	});
}

describe('createMulterSingle', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls next() when multer processes the file without error', async () => {
		mockSingle.mockReturnValue(makeInner((next) => (next as NextFunction)()));
		const handler = createMulterSingle('file', 10 * 1024 * 1024);
		await expect(run(handler)).resolves.toBeUndefined();
	});

	it('converts LIMIT_FILE_SIZE MulterError to AppError 413', async () => {
		const err = new FakeMulterError('LIMIT_FILE_SIZE');
		mockSingle.mockReturnValue(
			makeInner((next) => (next as NextFunction)(err)),
		);
		const handler = createMulterSingle('file', 1024);
		await expect(run(handler)).rejects.toMatchObject({
			statusCode: 413,
			code: STORAGE_ERRORS.FILE_SIZE_EXCEEDED,
		});
	});

	it('converts LIMIT_FILE_COUNT MulterError to AppError 400 TOO_MANY_FILES', async () => {
		const err = new FakeMulterError('LIMIT_FILE_COUNT');
		mockSingle.mockReturnValue(
			makeInner((next) => (next as NextFunction)(err)),
		);
		const handler = createMulterSingle('file', 1024);
		await expect(run(handler)).rejects.toMatchObject({
			statusCode: 400,
			code: STORAGE_ERRORS.TOO_MANY_FILES,
		});
	});

	it('converts unknown MulterError code to AppError UPLOAD_FAILED', async () => {
		const err = new FakeMulterError('LIMIT_UNEXPECTED_FILE');
		mockSingle.mockReturnValue(
			makeInner((next) => (next as NextFunction)(err)),
		);
		const handler = createMulterSingle('file', 1024);
		await expect(run(handler)).rejects.toMatchObject({
			code: STORAGE_ERRORS.UPLOAD_FAILED,
		});
	});

	it('passes non-MulterError to next unchanged', async () => {
		const originalError = new Error('something else');
		mockSingle.mockReturnValue(
			makeInner((next) => (next as NextFunction)(originalError)),
		);
		const handler = createMulterSingle('file', 1024);
		await expect(run(handler)).rejects.toBe(originalError);
	});
});

describe('createMulterArray', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls next() when multer processes files without error', async () => {
		mockArray.mockReturnValue(makeInner((next) => (next as NextFunction)()));
		const handler = createMulterArray('files', 5, 10 * 1024 * 1024);
		await expect(run(handler)).resolves.toBeUndefined();
	});

	it('converts LIMIT_FILE_SIZE MulterError to AppError 413', async () => {
		const err = new FakeMulterError('LIMIT_FILE_SIZE');
		mockArray.mockReturnValue(makeInner((next) => (next as NextFunction)(err)));
		const handler = createMulterArray('files', 5, 1024);
		await expect(run(handler)).rejects.toMatchObject({ statusCode: 413 });
	});

	it('passes non-MulterError to next unchanged', async () => {
		const originalError = new Error('network error');
		mockArray.mockReturnValue(
			makeInner((next) => (next as NextFunction)(originalError)),
		);
		const handler = createMulterArray('files', 5, 1024);
		await expect(run(handler)).rejects.toBe(originalError);
	});
});
