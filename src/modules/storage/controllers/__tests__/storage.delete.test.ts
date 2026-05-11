import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@Shared/domain/AppError';

const { mockDeleteFiles, mockSuccessResponse } = vi.hoisted(() => ({
	mockDeleteFiles: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/storage/application/deleteFiles', () => ({
	deleteFiles: mockDeleteFiles,
}));

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { storageDeleteController } from '../storage.delete';

function run(req: Request): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		storageDeleteController(req, {} as Response, next);
	});
}

describe('storageDeleteController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('passes AppError to next when urls is an empty array', async () => {
		const req = { body: { urls: [] } } as unknown as Request;
		await expect(run(req)).rejects.toBeInstanceOf(AppError);
	});

	it('passes AppError to next when urls is not an array', async () => {
		const req = { body: { urls: 'not-an-array' } } as unknown as Request;
		await expect(run(req)).rejects.toBeInstanceOf(AppError);
	});

	it('calls deleteFiles with the provided urls and returns 200', async () => {
		mockDeleteFiles.mockResolvedValue(undefined);
		const urls = ['https://cdn.example.com/file1.jpg'];
		const req = { body: { urls } } as unknown as Request;

		await run(req);

		expect(mockDeleteFiles).toHaveBeenCalledWith(urls);
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 200, data: null }),
		);
	});

	it('passes error to next when deleteFiles rejects', async () => {
		mockDeleteFiles.mockRejectedValue(new Error('delete failed'));
		const req = {
			body: { urls: ['https://cdn.example.com/file.jpg'] },
		} as unknown as Request;

		await expect(run(req)).rejects.toThrow('delete failed');
	});
});
