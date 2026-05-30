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
vi.mock('@Modules/collaborators/application/listCollaborators', () => ({
	listCollaborators: vi.fn(),
}));

import {
	collaboratorListPublicController,
	collaboratorListAdminController,
} from '@Modules/collaborators/controllers/collaborator.list';
import { listCollaborators } from '@Modules/collaborators/application/listCollaborators';
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

describe('collaboratorListPublicController', () => {
	it('calls listCollaborators with adminView false and returns 200', async () => {
		vi.mocked(listCollaborators).mockResolvedValue(mockResult);
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await collaboratorListPublicController(req, res, next);

		expect(listCollaborators).toHaveBeenCalledWith(
			expect.objectContaining({ adminView: false }),
		);
		expect(successResponse).toHaveBeenCalled();
	});
});

describe('collaboratorListAdminController', () => {
	it('calls listCollaborators with adminView true and returns 200', async () => {
		vi.mocked(listCollaborators).mockResolvedValue(mockResult);
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await collaboratorListAdminController(req, res, next);

		expect(listCollaborators).toHaveBeenCalledWith(
			expect.objectContaining({ adminView: true }),
		);
		expect(successResponse).toHaveBeenCalled();
	});
});
