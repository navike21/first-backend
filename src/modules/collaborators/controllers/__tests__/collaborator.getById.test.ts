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
vi.mock('@Modules/collaborators/application/getCollaboratorById', () => ({
	getCollaboratorById: vi.fn(),
}));

import { collaboratorGetByIdController } from '@Modules/collaborators/controllers/collaborator.getById';
import { getCollaboratorById } from '@Modules/collaborators/application/getCollaboratorById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('collaboratorGetByIdController', () => {
	it('calls getCollaboratorById and returns 200', async () => {
		vi.mocked(getCollaboratorById).mockResolvedValue({
			id: '1',
			name: 'Jane',
		} as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await collaboratorGetByIdController(req, res, next);

		expect(getCollaboratorById).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when member not found', async () => {
		vi.mocked(getCollaboratorById).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'bad-id' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		collaboratorGetByIdController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
