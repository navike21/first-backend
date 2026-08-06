import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/customers/infrastructure/CustomerModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getCustomerById } from '@Modules/customers/application/getCustomerById';
import CustomerModel from '@Modules/customers/infrastructure/CustomerModel';
import { CustomerNotFoundError } from '@Modules/customers/domain/errors/CustomerErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('getCustomerById', () => {
	it('returns customer data when found', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue(
			mockQueryBuilder({
				id: '1',
				firstName: 'Jane',
				_id: 'mongo1',
			}) as never,
		);

		const result = await getCustomerById('1');

		expect(result).not.toHaveProperty('_id');
		expect(result.firstName).toBe('Jane');
	});

	it('throws CustomerNotFoundError when not found', async () => {
		vi.mocked(CustomerModel.findOne).mockReturnValue(
			mockQueryBuilder(null) as never,
		);

		await expect(getCustomerById('not-found')).rejects.toThrow(
			CustomerNotFoundError,
		);
	});
});
