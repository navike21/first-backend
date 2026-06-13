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
vi.mock('@Modules/users/application/deleteUser', () => ({
	deleteUser: vi.fn(),
}));

import { deleteUserController } from '@Modules/users/controllers/user.delete';
import { deleteUser } from '@Modules/users/application/deleteUser';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('deleteUserController', () => {
	it('calls deleteUser with id param', async () => {
		vi.mocked(deleteUser).mockResolvedValue(undefined as never);
		const req = { params: { id: 'u1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await deleteUserController(req, res, next);
		expect(deleteUser).toHaveBeenCalledWith('u1', undefined);
		expect(successResponse).toHaveBeenCalled();
	});
});
