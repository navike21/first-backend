import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/users/application/deleteUserLogical', () => ({
	deleteUserLogical: vi.fn(),
}));

import { deleteUserLogicalController } from '@Modules/users/controllers/user.deleteLogical';
import { deleteUserLogical } from '@Modules/users/application/deleteUserLogical';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('deleteUserLogicalController', () => {
	it('calls deleteUserLogical and returns 200', async () => {
		vi.mocked(deleteUserLogical).mockResolvedValue({
			id: 'u-1',
			status: 'deleted',
		} as never);
		const req = { params: { id: 'u-1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await deleteUserLogicalController(req, res, next);

		expect(deleteUserLogical).toHaveBeenCalledWith('u-1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when user not found', async () => {
		vi.mocked(deleteUserLogical).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'bad-id' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		deleteUserLogicalController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
