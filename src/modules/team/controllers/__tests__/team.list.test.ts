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
vi.mock('@Modules/team/application/listTeamMembers', () => ({
	listTeamMembers: vi.fn(),
}));

import {
	teamListPublicController,
	teamListAdminController,
} from '@Modules/team/controllers/team.list';
import { listTeamMembers } from '@Modules/team/application/listTeamMembers';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const mockResult = {
	data: [],
	meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

describe('teamListPublicController', () => {
	it('calls listTeamMembers with adminView false and returns 200', async () => {
		vi.mocked(listTeamMembers).mockResolvedValue(mockResult);
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await teamListPublicController(req, res, next);

		expect(listTeamMembers).toHaveBeenCalledWith(
			expect.objectContaining({ adminView: false }),
		);
		expect(successResponse).toHaveBeenCalled();
	});
});

describe('teamListAdminController', () => {
	it('calls listTeamMembers with adminView true and returns 200', async () => {
		vi.mocked(listTeamMembers).mockResolvedValue(mockResult);
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await teamListAdminController(req, res, next);

		expect(listTeamMembers).toHaveBeenCalledWith(
			expect.objectContaining({ adminView: true }),
		);
		expect(successResponse).toHaveBeenCalled();
	});
});
