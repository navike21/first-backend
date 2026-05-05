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
vi.mock('@Modules/users/application/createUser', () => ({
	createUser: vi.fn(),
}));

import { createUserController } from '@Modules/users/controllers/user.create';
import { createUser } from '@Modules/users/application/createUser';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('createUserController', () => {
	it('calls createUser on valid input', async () => {
		vi.mocked(createUser).mockResolvedValue({ id: 'u1' } as never);
		const req = {
			body: {
				email: 'john@example.com',
				password: 'Password1',
				firstName: 'John',
				lastName: 'Doe',
			},
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await createUserController(req, res, next);
		expect(createUser).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await createUserController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
