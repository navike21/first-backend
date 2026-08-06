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
vi.mock('@Modules/customer-auth/application/registerCustomer', () => ({
	registerCustomer: vi.fn(),
}));

import { customerAuthRegister } from '@Modules/customer-auth/controllers/customerAuth.register';
import { registerCustomer } from '@Modules/customer-auth/application/registerCustomer';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('customerAuthRegister', () => {
	it('calls registerCustomer and responds on valid input', async () => {
		vi.mocked(registerCustomer).mockResolvedValue({ id: '1' } as never);
		const req = {
			body: {
				firstName: 'Jane',
				lastName: 'Doe',
				email: 'jane@example.com',
				password: 'NewPass1',
			},
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthRegister(req, res, next);

		expect(registerCustomer).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await customerAuthRegister(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
