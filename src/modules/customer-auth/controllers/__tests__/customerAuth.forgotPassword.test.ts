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
vi.mock('@Modules/customer-auth/application/forgotCustomerPassword', () => ({
	forgotCustomerPassword: vi.fn(),
}));

import { customerAuthForgotPassword } from '@Modules/customer-auth/controllers/customerAuth.forgotPassword';
import { forgotCustomerPassword } from '@Modules/customer-auth/application/forgotCustomerPassword';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('customerAuthForgotPassword', () => {
	it('calls forgotCustomerPassword and responds the same way regardless of outcome', async () => {
		vi.mocked(forgotCustomerPassword).mockResolvedValue(undefined);
		const req = { body: { email: 'a@b.com' } } as unknown as Request;
		const res = makeRes({ lang: 'en' });
		const next = vi.fn();

		await customerAuthForgotPassword(req, res, next);

		expect(forgotCustomerPassword).toHaveBeenCalledWith('a@b.com', 'en');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid email', async () => {
		const req = { body: { email: 'bad' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthForgotPassword(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
