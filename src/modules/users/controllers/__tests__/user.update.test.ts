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
vi.mock('@Modules/users/application/updateUser', () => ({
	updateUser: vi.fn(),
}));

import { updateUserController } from '@Modules/users/controllers/user.update';
import { updateUser } from '@Modules/users/application/updateUser';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('updateUserController', () => {
	it('calls updateUser on valid input', async () => {
		vi.mocked(updateUser).mockResolvedValue({ id: 'u1' } as never);
		const req = {
			params: { id: 'u1' },
			body: { firstName: 'Jane' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await updateUserController(req, res, next);
		expect(updateUser).toHaveBeenCalledWith('u1', expect.any(Object));
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = {
			params: { id: 'u1' },
			body: { firstName: 'X' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await updateUserController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
