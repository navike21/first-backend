import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/customers/infrastructure/CustomerModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateCustomer } from '@Modules/customers/application/updateCustomer';
import CustomerModel from '@Modules/customers/infrastructure/CustomerModel';
import {
	CustomerNotFoundError,
	CustomerEmailConflictError,
} from '@Modules/customers/domain/errors/CustomerErrors';

describe('updateCustomer', () => {
	it('updates and returns the customer', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			email: 'jane@example.com',
			save: saveFn,
			toObject: vi.fn().mockReturnValue({
				id: '1',
				email: 'jane@example.com',
				_id: 'mongo1',
			}),
		};
		vi.mocked(CustomerModel.findOne).mockResolvedValue(doc as never);

		const result = await updateCustomer('1', { firstName: 'Janet' });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws CustomerNotFoundError when the customer does not exist', async () => {
		vi.mocked(CustomerModel.findOne).mockResolvedValue(null as never);

		await expect(updateCustomer('missing', {})).rejects.toThrow(
			CustomerNotFoundError,
		);
	});

	it('throws CustomerEmailConflictError on duplicate email', async () => {
		const doc = { id: '1', email: 'jane@example.com', save: vi.fn() };
		vi.mocked(CustomerModel.findOne)
			.mockResolvedValueOnce(doc as never)
			.mockReturnValueOnce({
				lean: vi
					.fn()
					.mockResolvedValue({ id: '2', email: 'taken@example.com' }),
			} as never);

		await expect(
			updateCustomer('1', { email: 'taken@example.com' }),
		).rejects.toThrow(CustomerEmailConflictError);
	});
});
