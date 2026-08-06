import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/customers/infrastructure/CustomerModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listCustomers } from '@Modules/customers/application/listCustomers';
import CustomerModel from '@Modules/customers/infrastructure/CustomerModel';

const mockQueryBuilder = (items: unknown[]) => ({
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

describe('listCustomers', () => {
	it('returns paginated customers', async () => {
		const customers = [{ id: '1', firstName: 'Jane', _id: 'mongo1' }];
		vi.mocked(CustomerModel.find).mockReturnValue(
			mockQueryBuilder(customers) as never,
		);
		vi.mocked(CustomerModel.countDocuments).mockResolvedValue(1);

		const result = await listCustomers({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(result.data[0]).not.toHaveProperty('_id');
		expect(result.meta.total).toBe(1);
	});

	it('returns an empty list (no 404) when there are no customers', async () => {
		vi.mocked(CustomerModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);
		vi.mocked(CustomerModel.countDocuments).mockResolvedValue(0);

		const result = await listCustomers({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(0);
		expect(result.meta.total).toBe(0);
	});

	it('applies search filter when provided', async () => {
		const customers = [{ id: '1', firstName: 'Jane', _id: 'mongo1' }];
		vi.mocked(CustomerModel.find).mockReturnValue(
			mockQueryBuilder(customers) as never,
		);
		vi.mocked(CustomerModel.countDocuments).mockResolvedValue(1);

		const result = await listCustomers({
			page: 1,
			limit: 10,
			search: 'Jane',
		});

		expect(result.data).toHaveLength(1);
	});
});
