import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@Shared/domain/AppError';

const { mockDeleteFilesLogical, mockSuccessResponse } = vi.hoisted(() => ({
	mockDeleteFilesLogical: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/storage/application/deleteFilesLogical', () => ({
	deleteFilesLogical: mockDeleteFilesLogical,
}));

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { storageDeleteController } from '../storage.delete';

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

function buildRes(): Response {
	return { locals: {} } as unknown as Response;
}

function run(req: Request): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		storageDeleteController(req, buildRes(), next);
	});
}

describe('storageDeleteController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('passes AppError to next when ids is an empty array', async () => {
		const req = { body: { ids: [] } } as unknown as Request;
		await expect(run(req)).rejects.toBeInstanceOf(AppError);
	});

	it('passes AppError to next when ids is not an array', async () => {
		const req = { body: { ids: 'not-an-array' } } as unknown as Request;
		await expect(run(req)).rejects.toBeInstanceOf(AppError);
	});

	it('passes AppError to next when ids is missing', async () => {
		const req = { body: {} } as unknown as Request;
		await expect(run(req)).rejects.toBeInstanceOf(AppError);
	});

	it('calls deleteFilesLogical with the provided ids and returns 200', async () => {
		mockDeleteFilesLogical.mockResolvedValue(undefined);
		const ids = [VALID_UUID];
		const req = { body: { ids } } as unknown as Request;

		await run(req);

		expect(mockDeleteFilesLogical).toHaveBeenCalledWith(ids);
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 200, data: null }),
		);
	});

	it('passes error to next when deleteFilesLogical rejects', async () => {
		mockDeleteFilesLogical.mockRejectedValue(new Error('delete failed'));
		const req = { body: { ids: [VALID_UUID] } } as unknown as Request;

		await expect(run(req)).rejects.toThrow('delete failed');
	});
});
