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
vi.mock('@Shared/infrastructure/CustomerJwtService', () => ({
	CustomerJwtService: { verifyAccess: vi.fn() },
}));

import { authenticateCustomer } from '@Modules/customer-auth/middlewares/authenticateCustomer';
import { CustomerJwtService } from '@Shared/infrastructure/CustomerJwtService';

describe('authenticateCustomer', () => {
	it('calls next with error when no auth header', async () => {
		const req = { headers: {} } as Request;
		const res = { locals: {} } as unknown as Response;
		const next = vi.fn();
		await authenticateCustomer(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('calls next with error when auth header does not start with Bearer', async () => {
		const req = {
			headers: { authorization: 'Basic abc' },
		} as unknown as Request;
		const res = { locals: {} } as unknown as Response;
		const next = vi.fn();
		await authenticateCustomer(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('sets customerId and calls next on valid token', async () => {
		vi.mocked(CustomerJwtService.verifyAccess).mockReturnValue({
			sub: 'customer1',
		} as never);
		const req = {
			headers: { authorization: 'Bearer validtoken' },
		} as unknown as Request;
		const res = { locals: {} } as unknown as Response;
		const next = vi.fn();
		await authenticateCustomer(req, res, next);
		expect(res.locals.customerId).toBe('customer1');
		expect(res.locals.permissions).toBeUndefined();
		expect(next).toHaveBeenCalledWith();
	});

	it('calls next with error on invalid token', async () => {
		vi.mocked(CustomerJwtService.verifyAccess).mockImplementation(() => {
			throw new Error('invalid');
		});
		const req = {
			headers: { authorization: 'Bearer badtoken' },
		} as unknown as Request;
		const res = { locals: {} } as unknown as Response;
		const next = vi.fn();
		await authenticateCustomer(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
