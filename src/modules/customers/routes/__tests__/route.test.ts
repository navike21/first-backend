import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/customers/application/createCustomer', () => ({
	createCustomer: vi.fn(),
}));
vi.mock('@Modules/customers/application/updateCustomer', () => ({
	updateCustomer: vi.fn(),
}));
vi.mock('@Modules/customers/application/getCustomerById', () => ({
	getCustomerById: vi.fn(),
}));
vi.mock('@Modules/customers/application/listCustomers', () => ({
	listCustomers: vi.fn(),
}));
vi.mock('@Modules/customers/application/deleteCustomerLogical', () => ({
	deleteCustomerLogical: vi.fn(),
}));
vi.mock('@Modules/customers/application/deleteCustomerPhysical', () => ({
	deleteCustomerPhysical: vi.fn(),
}));
vi.mock('@Modules/customers/application/restoreCustomer', () => ({
	restoreCustomer: vi.fn(),
}));
vi.mock('@Modules/customers/application/listDeletedCustomers', () => ({
	listDeletedCustomers: vi.fn(),
}));
vi.mock('@Modules/customers/application/deleteCustomersBulk', () => ({
	deleteCustomersBulk: vi.fn(),
}));
vi.mock('@Modules/customers/application/restoreCustomersBulk', () => ({
	restoreCustomersBulk: vi.fn(),
}));
vi.mock('@Modules/customers/application/purgeCustomersBulk', () => ({
	purgeCustomersBulk: vi.fn(),
}));

import { Router } from 'express';
import { customersApi } from '@Modules/customers/routes/route';

describe('customersApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => customersApi(router)).not.toThrow();
	});
});
