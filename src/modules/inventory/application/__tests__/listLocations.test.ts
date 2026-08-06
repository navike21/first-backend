import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/inventory/infrastructure/LocationModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listLocations } from '@Modules/inventory/application/listLocations';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';

const mockQueryBuilder = (items: unknown[]) => ({
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

describe('listLocations', () => {
	it('returns paginated locations', async () => {
		const locations = [{ id: '1', name: 'Almacén', _id: 'mongo1' }];
		vi.mocked(LocationModel.find).mockReturnValue(
			mockQueryBuilder(locations) as never,
		);
		vi.mocked(LocationModel.countDocuments).mockResolvedValue(1);

		const result = await listLocations({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(result.data[0]).not.toHaveProperty('_id');
		expect(result.meta.total).toBe(1);
	});

	it('returns an empty list (no 404) when there are no locations', async () => {
		vi.mocked(LocationModel.find).mockReturnValue(
			mockQueryBuilder([]) as never,
		);
		vi.mocked(LocationModel.countDocuments).mockResolvedValue(0);

		const result = await listLocations({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(0);
	});
});
