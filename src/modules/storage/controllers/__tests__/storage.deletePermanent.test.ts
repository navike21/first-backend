import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@Shared/domain/AppError';

const { mockDeleteFilesPermanent, mockSuccessResponse } = vi.hoisted(() => ({
	mockDeleteFilesPermanent: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/storage/application/deleteFilesPermanent', () => ({
	deleteFilesPermanent: mockDeleteFilesPermanent,
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { storageDeletePermanentController } from '../storage.deletePermanent';

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
		storageDeletePermanentController(req, buildRes(), next);
	});
}

describe('storageDeletePermanentController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls deleteFilesPermanent and returns 200', async () => {
		mockDeleteFilesPermanent.mockResolvedValue(undefined);
		const req = { body: { ids: [VALID_UUID] } } as unknown as Request;

		await run(req);

		expect(mockDeleteFilesPermanent).toHaveBeenCalledWith([VALID_UUID]);
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 200 }),
		);
	});

	it('passes AppError to next when ids is missing', async () => {
		const req = { body: {} } as unknown as Request;
		await expect(run(req)).rejects.toBeInstanceOf(AppError);
	});

	it('passes AppError to next when ids is empty array', async () => {
		const req = { body: { ids: [] } } as unknown as Request;
		await expect(run(req)).rejects.toBeInstanceOf(AppError);
	});

	it('passes error to next when deleteFilesPermanent rejects', async () => {
		mockDeleteFilesPermanent.mockRejectedValue(new Error('storage error'));
		const req = { body: { ids: [VALID_UUID] } } as unknown as Request;
		await expect(run(req)).rejects.toThrow('storage error');
	});
});
