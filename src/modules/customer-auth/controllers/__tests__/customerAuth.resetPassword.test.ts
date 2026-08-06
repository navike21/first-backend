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
vi.mock('@Modules/customer-auth/application/resetCustomerPassword', () => ({
	resetCustomerPassword: vi.fn(),
}));

import { customerAuthResetPassword } from '@Modules/customer-auth/controllers/customerAuth.resetPassword';
import { resetCustomerPassword } from '@Modules/customer-auth/application/resetCustomerPassword';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('customerAuthResetPassword', () => {
	it('calls resetCustomerPassword and responds on valid input', async () => {
		vi.mocked(resetCustomerPassword).mockResolvedValue(undefined);
		const req = {
			params: { token: 'valid-token' },
			body: { password: 'NewPass1' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthResetPassword(req, res, next);

		expect(resetCustomerPassword).toHaveBeenCalledWith(
			'valid-token',
			'NewPass1',
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when the token param is missing', async () => {
		const req = {
			params: {},
			body: { password: 'NewPass1' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthResetPassword(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
