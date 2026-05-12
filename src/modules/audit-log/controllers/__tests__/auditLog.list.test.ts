import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Response, NextFunction } from 'express';

const { mockListAuditLogs, mockSuccessResponse } = vi.hoisted(() => ({
	mockListAuditLogs: vi.fn(),
	mockSuccessResponse: vi.fn(),
}));

vi.mock('@Modules/audit-log/application/listAuditLogs', () => ({
	listAuditLogs: mockListAuditLogs,
}));

vi.mock('@Helpers/responseStructure', () => ({
	successResponse: mockSuccessResponse,
}));

import { auditLogListController } from '../auditLog.list';

function run(query: object = {}): Promise<void> {
	return new Promise((resolve, reject) => {
		mockSuccessResponse.mockReset();
		mockSuccessResponse.mockImplementationOnce(() => resolve());
		const next: NextFunction = (err?: unknown) =>
			err ? reject(err) : resolve();
		auditLogListController(
			{ query } as unknown as Request,
			{} as Response,
			next,
		);
	});
}

describe('auditLogListController', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls listAuditLogs and returns 200 with valid query', async () => {
		mockListAuditLogs.mockResolvedValue({ data: [], meta: { total: 0 } });

		await run({ page: '1', limit: '20' });

		expect(mockListAuditLogs).toHaveBeenCalledOnce();
		expect(mockSuccessResponse).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ statusCode: 200, data: [] }),
		);
	});

	it('passes default page and limit when query is empty', async () => {
		mockListAuditLogs.mockResolvedValue({ data: [], meta: {} });
		await run({});
		expect(mockListAuditLogs).toHaveBeenCalledWith(
			expect.objectContaining({ page: 1, limit: 20 }),
		);
	});

	it('passes filters through to listAuditLogs', async () => {
		mockListAuditLogs.mockResolvedValue({ data: [], meta: {} });
		await run({ userId: 'u1', action: 'auth:login', resource: 'auth' });
		expect(mockListAuditLogs).toHaveBeenCalledWith(
			expect.objectContaining({
				userId: 'u1',
				action: 'auth:login',
				resource: 'auth',
			}),
		);
	});

	it('calls next with AppError when query validation fails', async () => {
		await expect(run({ page: '0' })).rejects.toMatchObject({ statusCode: 400 });
	});

	it('passes error to next when listAuditLogs rejects', async () => {
		mockListAuditLogs.mockRejectedValue(new Error('db error'));
		await expect(run({})).rejects.toThrow('db error');
	});
});
