import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listClients } from '@Modules/clients/application/listClients';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';

const mockQueryBuilder = (items: unknown[]) => ({
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	select: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

describe('listClients', () => {
	it('returns paginated clients', async () => {
		const clients = [{ id: '1', businessName: 'Acme', _id: 'mongo1' }];
		vi.mocked(ClientModel.find).mockReturnValue(
			mockQueryBuilder(clients) as never,
		);
		vi.mocked(ClientModel.countDocuments).mockResolvedValue(1);

		const result = await listClients({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(result.data[0]).not.toHaveProperty('_id');
		expect(result.meta.total).toBe(1);
	});

	it('returns an empty list (no 404) when there are no clients', async () => {
		vi.mocked(ClientModel.find).mockReturnValue(mockQueryBuilder([]) as never);
		vi.mocked(ClientModel.countDocuments).mockResolvedValue(0);

		const result = await listClients({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(0);
		expect(result.meta.total).toBe(0);
	});

	it('applies search filter when provided', async () => {
		const clients = [{ id: '1', businessName: 'Acme', _id: 'mongo1' }];
		vi.mocked(ClientModel.find).mockReturnValue(
			mockQueryBuilder(clients) as never,
		);
		vi.mocked(ClientModel.countDocuments).mockResolvedValue(1);

		const result = await listClients({ page: 1, limit: 10, search: 'Acme' });

		expect(result.data).toHaveLength(1);
	});
});
