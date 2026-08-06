import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/customers/infrastructure/CustomerModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

import { createCustomer } from '@Modules/customers/application/createCustomer';
import CustomerModel from '@Modules/customers/infrastructure/CustomerModel';
import { CustomerEmailConflictError } from '@Modules/customers/domain/errors/CustomerErrors';

const validInput = {
	firstName: 'Jane',
	lastName: 'Doe',
	email: 'jane@example.com',
	addresses: [],
};

describe('createCustomer', () => {
	it('creates a customer and returns cleaned data', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);
		vi.mocked(CustomerModel.create).mockResolvedValue({
			...validInput,
			id: '1',
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: '1', _id: 'mongo1' }),
		} as never);

		const result = await createCustomer(validInput);

		expect(CustomerModel.create).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws CustomerEmailConflictError when a customer with the same email already exists', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'existing' }),
		} as never);

		await expect(createCustomer(validInput)).rejects.toThrow(
			CustomerEmailConflictError,
		);
	});
});
