import { describe, it, expect, vi } from 'vitest';

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
vi.mock('@Modules/customer-auth/application/loginCustomer', () => ({
	loginCustomer: vi.fn(),
}));
vi.mock('@Modules/customer-auth/application/refreshCustomerToken', () => ({
	rotateCustomerRefreshToken: vi.fn(),
}));
vi.mock('@Modules/customer-auth/application/logoutCustomer', () => ({
	logoutCustomer: vi.fn(),
}));
vi.mock('@Modules/customer-auth/application/forgotCustomerPassword', () => ({
	forgotCustomerPassword: vi.fn(),
}));
vi.mock('@Modules/customer-auth/application/resetCustomerPassword', () => ({
	resetCustomerPassword: vi.fn(),
}));
vi.mock('@Shared/infrastructure/CustomerJwtService', () => ({
	CustomerJwtService: { verifyAccess: vi.fn() },
}));

import { Router } from 'express';
import { customerAuthApi } from '@Modules/customer-auth/routes/route';

describe('customerAuthApi route', () => {
	it('registers routes on the router', () => {
		const router = Router();
		expect(() => customerAuthApi(router)).not.toThrow();
	});
});
