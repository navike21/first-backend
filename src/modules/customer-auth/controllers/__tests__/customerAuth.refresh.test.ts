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
vi.mock('@Modules/customer-auth/application/refreshCustomerToken', () => ({
	rotateCustomerRefreshToken: vi.fn(),
}));

import { customerAuthRefresh } from '@Modules/customer-auth/controllers/customerAuth.refresh';
import { rotateCustomerRefreshToken } from '@Modules/customer-auth/application/refreshCustomerToken';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('customerAuthRefresh', () => {
	it('rotates the token and sets a new cookie', async () => {
		vi.mocked(rotateCustomerRefreshToken).mockResolvedValue({
			accessToken: 'new-acc',
			refreshToken: 'new-ref',
			refreshExpiresMs: 3600000,
		} as never);
		const req = {
			cookies: { customerRefreshToken: 'old-ref' },
			headers: {},
			socket: { remoteAddress: '127.0.0.1' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthRefresh(req, res, next);

		expect(rotateCustomerRefreshToken).toHaveBeenCalledWith(
			'old-ref',
			'',
			'127.0.0.1',
		);
		expect(res.cookie).toHaveBeenCalledWith(
			'customerRefreshToken',
			'new-ref',
			expect.any(Object),
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when there is no refresh cookie', async () => {
		const req = { cookies: {}, headers: {}, socket: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthRefresh(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
