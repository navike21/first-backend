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
vi.mock('@Modules/team/application/getTeamMemberById', () => ({
	getTeamMemberById: vi.fn(),
}));

import { teamGetByIdController } from '@Modules/team/controllers/team.getById';
import { getTeamMemberById } from '@Modules/team/application/getTeamMemberById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('teamGetByIdController', () => {
	it('calls getTeamMemberById and returns 200', async () => {
		vi.mocked(getTeamMemberById).mockResolvedValue({
			id: '1',
			name: 'Jane',
		} as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await teamGetByIdController(req, res, next);

		expect(getTeamMemberById).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when member not found', async () => {
		vi.mocked(getTeamMemberById).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'bad-id' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		teamGetByIdController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
