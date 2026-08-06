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
vi.mock('@Modules/customer-auth/application/loginCustomer', () => ({
	loginCustomer: vi.fn(),
}));

import { customerAuthLogin } from '@Modules/customer-auth/controllers/customerAuth.login';
import { loginCustomer } from '@Modules/customer-auth/application/loginCustomer';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('customerAuthLogin', () => {
	it('calls loginCustomer and sets cookie on valid input', async () => {
		vi.mocked(loginCustomer).mockResolvedValue({
			accessToken: 'acc',
			refreshToken: 'ref',
			refreshExpiresMs: 3600000,
			customer: {},
		} as never);
		const req = {
			body: { email: 'a@b.com', password: 'Password1' },
			headers: { 'x-forwarded-for': '10.0.0.1', 'user-agent': 'test-agent' },
			socket: { remoteAddress: '127.0.0.1' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthLogin(req, res, next);

		expect(loginCustomer).toHaveBeenCalled();
		expect(res.cookie).toHaveBeenCalledWith(
			'customerRefreshToken',
			'ref',
			expect.any(Object),
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {}, headers: {}, socket: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthLogin(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
