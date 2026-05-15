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
vi.mock('@Modules/team/application/deleteTeamMember', () => ({
	deleteTeamMember: vi.fn(),
}));

import { teamDeleteController } from '@Modules/team/controllers/team.delete';
import { deleteTeamMember } from '@Modules/team/application/deleteTeamMember';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('teamDeleteController', () => {
	it('calls deleteTeamMember and returns 200', async () => {
		vi.mocked(deleteTeamMember).mockResolvedValue({
			id: '1',
			status: 'deleted',
		} as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await teamDeleteController(req, res, next);

		expect(deleteTeamMember).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when member not found', async () => {
		vi.mocked(deleteTeamMember).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'bad-id' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		teamDeleteController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
