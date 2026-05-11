import { describe, it, expect, vi } from 'vitest';
import type { Router } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: {
		STORAGE_MAX_FILE_SIZE_BYTES: 10485760,
		STORAGE_MAX_FILES_BULK: 10,
	},
}));

vi.mock('@Modules/auth', () => ({
	authenticate: vi.fn(),
	authorize: vi.fn(() => vi.fn()),
}));

vi.mock('multer', () => {
	const upload = { single: vi.fn(() => vi.fn()), array: vi.fn(() => vi.fn()) };
	const fn = vi.fn(() => upload) as ReturnType<typeof vi.fn> & {
		memoryStorage: ReturnType<typeof vi.fn>;
		MulterError: new (code: string) => Error;
	};
	fn.memoryStorage = vi.fn(() => ({}));
	fn.MulterError = class extends Error {
		constructor(public code: string) {
			super(code);
		}
	};
	return { default: fn };
});

vi.mock('file-type', () => ({ fileTypeFromBuffer: vi.fn() }));

import { storageApi } from '../route';

describe('storageApi', () => {
	it('registers POST /storage/upload, POST /storage/upload-bulk and DELETE /storage/delete', () => {
		const post = vi.fn();
		const del = vi.fn();
		const mockRouter = { post, delete: del } as unknown as Router;

		storageApi(mockRouter);

		expect(post).toHaveBeenCalledTimes(2);
		expect(del).toHaveBeenCalledTimes(1);

		const postPaths = post.mock.calls.map((call) => call[0]);
		expect(postPaths).toContain('/storage/upload');
		expect(postPaths).toContain('/storage/upload-bulk');

		const deletePaths = del.mock.calls.map((call) => call[0]);
		expect(deletePaths).toContain('/storage/delete');
	});
});
