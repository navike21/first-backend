import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: {
		NODE_ENV: 'test',
		JWT_CUSTOMER_ACCESS_SECRET: 'access-secret',
		JWT_CUSTOMER_REFRESH_SECRET: 'refresh-secret',
		JWT_CUSTOMER_ACCESS_EXPIRES: '15m',
		JWT_CUSTOMER_REFRESH_EXPIRES: '1h',
	},
}));
vi.mock('@Modules/customers', () => ({
	CustomerModel: { findOne: vi.fn() },
}));
vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { compare: vi.fn() },
}));
vi.mock(
	'@Modules/customer-auth/infrastructure/CustomerRefreshTokenModel',
	() => ({
		default: { create: vi.fn() },
	}),
);
vi.mock('@Modules/customer-auth/infrastructure/CustomerSessionModel', () => ({
	default: { create: vi.fn() },
}));

import { loginCustomer } from '@Modules/customer-auth/application/loginCustomer';
import { CustomerModel } from '@Modules/customers';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';
import CustomerRefreshTokenModel from '@Modules/customer-auth/infrastructure/CustomerRefreshTokenModel';
import CustomerSessionModel from '@Modules/customer-auth/infrastructure/CustomerSessionModel';
import { InvalidCustomerCredentialsError } from '@Modules/customer-auth/domain/errors/CustomerAuthErrors';

const customerDoc = {
	id: 'cust-1',
	email: 'jane@example.com',
	firstName: 'Jane',
	lastName: 'Doe',
	passwordHash: 'hashed',
};

const loginInput = {
	email: 'jane@example.com',
	password: 'NewPass1',
	userAgent: 'test-agent',
	ip: '127.0.0.1',
};

describe('loginCustomer', () => {
	it('logs in and returns tokens on valid credentials', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue({
			select: vi.fn().mockResolvedValue(customerDoc),
		} as never);
		vi.mocked(HashedPassword.compare).mockResolvedValue(true);
		vi.mocked(CustomerRefreshTokenModel.create).mockResolvedValue({} as never);
		vi.mocked(CustomerSessionModel.create).mockResolvedValue({} as never);

		const result = await loginCustomer(loginInput);

		expect(result.accessToken).toBeDefined();
		expect(result.refreshToken).toBeDefined();
		expect(result.customer.email).toBe('jane@example.com');
	});

	it('throws InvalidCustomerCredentialsError when the customer does not exist', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue({
			select: vi.fn().mockResolvedValue(null),
		} as never);

		await expect(loginCustomer(loginInput)).rejects.toThrow(
			InvalidCustomerCredentialsError,
		);
	});

	it('throws InvalidCustomerCredentialsError on a wrong password', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue({
			select: vi.fn().mockResolvedValue(customerDoc),
		} as never);
		vi.mocked(HashedPassword.compare).mockResolvedValue(false);

		await expect(loginCustomer(loginInput)).rejects.toThrow(
			InvalidCustomerCredentialsError,
		);
	});
});
