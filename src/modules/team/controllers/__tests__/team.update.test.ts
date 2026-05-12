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
vi.mock('@Modules/team/application/updateTeamMember', () => ({
	updateTeamMember: vi.fn(),
}));

import { teamUpdateController } from '@Modules/team/controllers/team.update';
import { updateTeamMember } from '@Modules/team/application/updateTeamMember';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('teamUpdateController', () => {
	it('calls updateTeamMember and returns 200 on valid input', async () => {
		vi.mocked(updateTeamMember).mockResolvedValue({
			id: '1',
			name: 'New Name',
		} as never);
		const req = {
			params: { id: '1' },
			body: { name: 'New Name' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await teamUpdateController(req, res, next);

		expect(updateTeamMember).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = {
			params: { id: '1' },
			body: { photoUrl: 'not-a-url' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await teamUpdateController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
