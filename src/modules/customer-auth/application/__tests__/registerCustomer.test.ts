import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/customers', () => ({
	CustomerModel: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { hash: vi.fn().mockResolvedValue('hashed') },
}));

import { registerCustomer } from '@Modules/customer-auth/application/registerCustomer';
import { CustomerModel } from '@Modules/customers';
import { CustomerAlreadyRegisteredError } from '@Modules/customer-auth/domain/errors/CustomerAuthErrors';

const validInput = {
	firstName: 'Jane',
	lastName: 'Doe',
	email: 'jane@example.com',
	password: 'NewPass1',
};

describe('registerCustomer', () => {
	it('creates a customer with a hashed password and returns cleaned data', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);
		vi.mocked(CustomerModel.create).mockResolvedValue({
			id: '1',
			toObject: vi.fn().mockReturnValue({ id: '1', _id: 'mongo1' }),
		} as never);

		const result = await registerCustomer(validInput);

		expect(CustomerModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ passwordHash: 'hashed', emailVerified: false }),
		);
		expect(result).not.toHaveProperty('_id');
	});

	it('throws CustomerAlreadyRegisteredError when the email is taken', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'existing' }),
		} as never);

		await expect(registerCustomer(validInput)).rejects.toThrow(
			CustomerAlreadyRegisteredError,
		);
	});
});
