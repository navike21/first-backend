import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const { mockListDeletedStorageFiles, mockSuccessResponse } = vi.hoisted(() => ({
	mockListDeletedStorageFiles: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/storage/application/listDeletedStorageFiles', () => ({
	listDeletedStorageFiles: mockListDeletedStorageFiles,
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { storageTrashController } from '../storage.trash';

function buildRes(): Response {
	return { locals: {} } as unknown as Response;
}

function run(req: Request): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		storageTrashController(req, buildRes(), next);
	});
}

describe('storageTrashController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls listDeletedStorageFiles with defaults and returns 200', async () => {
		mockListDeletedStorageFiles.mockResolvedValue({
			items: [],
			meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
		});
		const req = { query: {} } as unknown as Request;

		await run(req);

		expect(mockListDeletedStorageFiles).toHaveBeenCalledWith(
			expect.objectContaining({ page: 1, limit: 20 }),
		);
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 200 }),
		);
	});

	it('passes kind/search from query to listDeletedStorageFiles', async () => {
		mockListDeletedStorageFiles.mockResolvedValue({
			items: [],
			meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
		});
		const req = {
			query: { kind: 'video', search: 'clip', page: '2', limit: '10' },
		} as unknown as Request;

		await run(req);

		expect(mockListDeletedStorageFiles).toHaveBeenCalledWith(
			expect.objectContaining({ kind: 'video', search: 'clip', page: 2, limit: 10 }),
		);
	});

	it('passes error to next when listDeletedStorageFiles rejects', async () => {
		mockListDeletedStorageFiles.mockRejectedValue(new Error('db error'));
		const req = { query: {} } as unknown as Request;
		await expect(run(req)).rejects.toThrow('db error');
	});
});
