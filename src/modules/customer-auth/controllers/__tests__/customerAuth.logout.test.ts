import { describe, it, expect, vi } from 'vitest';
import type { Request } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/customer-auth/application/logoutCustomer', () => ({
	logoutCustomer: vi.fn(),
}));

import { customerAuthLogout } from '@Modules/customer-auth/controllers/customerAuth.logout';
import { logoutCustomer } from '@Modules/customer-auth/application/logoutCustomer';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('customerAuthLogout', () => {
	it('logs out and clears the cookie when a token is present', async () => {
		vi.mocked(logoutCustomer).mockResolvedValue(undefined);
		const req = {
			cookies: { customerRefreshToken: 'ref' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthLogout(req, res, next);

		expect(logoutCustomer).toHaveBeenCalledWith('ref');
		expect(res.clearCookie).toHaveBeenCalledWith(
			'customerRefreshToken',
			expect.any(Object),
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('clears the cookie and responds even without a token', async () => {
		const req = { cookies: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthLogout(req, res, next);

		expect(logoutCustomer).not.toHaveBeenCalled();
		expect(res.clearCookie).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});
});
