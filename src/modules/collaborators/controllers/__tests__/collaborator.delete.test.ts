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
vi.mock('@Modules/collaborators/application/deleteCollaborator', () => ({
	deleteCollaborator: vi.fn(),
}));

import { collaboratorDeleteController } from '@Modules/collaborators/controllers/collaborator.delete';
import { deleteCollaborator } from '@Modules/collaborators/application/deleteCollaborator';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('collaboratorDeleteController', () => {
	it('calls deleteCollaborator and returns 200', async () => {
		vi.mocked(deleteCollaborator).mockResolvedValue({
			id: '1',
			status: 'deleted',
		} as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await collaboratorDeleteController(req, res, next);

		expect(deleteCollaborator).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when member not found', async () => {
		vi.mocked(deleteCollaborator).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'bad-id' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		collaboratorDeleteController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
