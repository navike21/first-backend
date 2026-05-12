import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const { mockGetAuditLogById, mockSuccessResponse } = vi.hoisted(() => ({
	mockGetAuditLogById: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/audit-log/application/getAuditLogById', () => ({
	getAuditLogById: mockGetAuditLogById,
}));

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { auditLogGetByIdController } from '../auditLog.getById';

function run(id: string): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		auditLogGetByIdController(
			{ params: { id } } as unknown as Request,
			{} as Response,
			next,
		);
	});
}

describe('auditLogGetByIdController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls getAuditLogById and returns 200', async () => {
		const log = { id: 'abc', action: 'auth:login', resource: 'auth' };
		mockGetAuditLogById.mockResolvedValue(log);

		await run('abc');

		expect(mockGetAuditLogById).toHaveBeenCalledWith('abc');
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 200, data: log }),
		);
	});

	it('passes error to next when getAuditLogById rejects', async () => {
		mockGetAuditLogById.mockRejectedValue(new Error('not found'));
		await expect(run('missing')).rejects.toThrow('not found');
	});
});
