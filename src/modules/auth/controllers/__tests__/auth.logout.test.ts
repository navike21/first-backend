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
vi.mock('@Modules/auth/application/logoutUser', () => ({
	logoutUser: vi.fn(),
}));

import { authLogout } from '@Modules/auth/controllers/auth.logout';
import { logoutUser } from '@Modules/auth/application/logoutUser';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		clearCookie: vi.fn(),
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('authLogout', () => {
	it('calls logoutUser when refreshToken cookie is present', async () => {
		vi.mocked(logoutUser).mockResolvedValue(undefined as never);
		const req = { cookies: { refreshToken: 'mytoken' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await authLogout(req, res, next);
		expect(logoutUser).toHaveBeenCalledWith('mytoken');
		expect(res.clearCookie).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('skips logoutUser when no refreshToken cookie', async () => {
		const req = { cookies: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await authLogout(req, res, next);
		expect(logoutUser).not.toHaveBeenCalled();
		expect(res.clearCookie).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});
});
