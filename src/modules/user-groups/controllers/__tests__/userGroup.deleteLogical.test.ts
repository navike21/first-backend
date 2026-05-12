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
vi.mock('@Modules/user-groups/application/deleteUserGroupLogical', () => ({
	deleteUserGroupLogical: vi.fn(),
}));

import { deleteUserGroupLogicalController } from '@Modules/user-groups/controllers/userGroup.deleteLogical';
import { deleteUserGroupLogical } from '@Modules/user-groups/application/deleteUserGroupLogical';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('deleteUserGroupLogicalController', () => {
	it('calls deleteUserGroupLogical and returns 200', async () => {
		vi.mocked(deleteUserGroupLogical).mockResolvedValue({
			id: '1',
			status: 'deleted',
		} as never);
		const req = { params: { id: 'group-1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await deleteUserGroupLogicalController(req, res, next);

		expect(deleteUserGroupLogical).toHaveBeenCalledWith('group-1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when group not found', async () => {
		vi.mocked(deleteUserGroupLogical).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'bad-id' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		deleteUserGroupLogicalController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
