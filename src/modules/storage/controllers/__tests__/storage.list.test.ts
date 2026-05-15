import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const { mockListStorageFiles, mockSuccessResponse } = vi.hoisted(() => ({
	mockListStorageFiles: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/storage/application/listStorageFiles', () => ({
	listStorageFiles: mockListStorageFiles,
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { storageListController } from '../storage.list';

function buildRes(): Response {
	return { locals: {} } as unknown as Response;
}

function run(req: Request): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		storageListController(req, buildRes(), next);
	});
}

describe('storageListController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls listStorageFiles and returns 200', async () => {
		mockListStorageFiles.mockResolvedValue({
			items: [],
			meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
		});
		const req = { query: {} } as unknown as Request;

		await run(req);

		expect(mockListStorageFiles).toHaveBeenCalled();
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 200 }),
		);
	});

	it('passes filters from query to listStorageFiles', async () => {
		mockListStorageFiles.mockResolvedValue({
			items: [],
			meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
		});
		const req = {
			query: { status: 'active', page: '2', limit: '10' },
		} as unknown as Request;

		await run(req);

		expect(mockListStorageFiles).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'active', page: 2, limit: 10 }),
		);
	});

	it('passes error to next when listStorageFiles rejects', async () => {
		mockListStorageFiles.mockRejectedValue(new Error('db error'));
		const req = { query: {} } as unknown as Request;
		await expect(run(req)).rejects.toThrow('db error');
	});
});
