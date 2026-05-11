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
vi.mock('@Modules/auth/application/forgotPassword', () => ({
	forgotPassword: vi.fn(),
}));

import { authForgotPassword } from '@Modules/auth/controllers/auth.forgotPassword';
import { forgotPassword } from '@Modules/auth/application/forgotPassword';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: { lang: 'en' },
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('authForgotPassword', () => {
	it('calls forgotPassword on valid input', async () => {
		vi.mocked(forgotPassword).mockResolvedValue(undefined as never);
		const req = { body: { email: 'a@b.com' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await authForgotPassword(req, res, next);
		expect(forgotPassword).toHaveBeenCalledWith('a@b.com', 'en');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await authForgotPassword(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
