import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/customers/infrastructure/CustomerModel', () => ({
	default: { findOne: vi.fn() },
}));

import { deleteCustomerLogical } from '@Modules/customers/application/deleteCustomerLogical';
import CustomerModel from '@Modules/customers/infrastructure/CustomerModel';
import { CustomerNotFoundError } from '@Modules/customers/domain/errors/CustomerErrors';

describe('deleteCustomerLogical', () => {
	it('soft-deletes the customer and returns data', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			status: 'active',
			save: saveFn,
			toObject: vi.fn().mockReturnValue({ id: '1', _id: 'mongo1' }),
		};
		vi.mocked(CustomerModel.findOne).mockResolvedValue(doc as never);

		const result = await deleteCustomerLogical('1');

		expect(saveFn).toHaveBeenCalled();
		expect((doc as { deletedAt?: Date }).deletedAt).toBeInstanceOf(Date);
		expect(result).not.toHaveProperty('_id');
	});

	it('throws CustomerNotFoundError when the customer does not exist', async () => {
		vi.mocked(CustomerModel.findOne).mockResolvedValue(null as never);

		await expect(deleteCustomerLogical('not-found')).rejects.toThrow(
			CustomerNotFoundError,
		);
	});
});
