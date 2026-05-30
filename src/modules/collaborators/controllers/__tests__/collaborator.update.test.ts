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
vi.mock('@Modules/collaborators/application/updateCollaborator', () => ({
	updateCollaborator: vi.fn(),
}));

import { collaboratorUpdateController } from '@Modules/collaborators/controllers/collaborator.update';
import { updateCollaborator } from '@Modules/collaborators/application/updateCollaborator';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('collaboratorUpdateController', () => {
	it('calls updateCollaborator and returns 200 on valid input', async () => {
		vi.mocked(updateCollaborator).mockResolvedValue({
			id: '1',
			name: 'New Name',
		} as never);
		const req = {
			params: { id: '1' },
			body: { name: 'New Name' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await collaboratorUpdateController(req, res, next);

		expect(updateCollaborator).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = {
			params: { id: '1' },
			body: { photoUrl: 'not-a-url' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await collaboratorUpdateController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
