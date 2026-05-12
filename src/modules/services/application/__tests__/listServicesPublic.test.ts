import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/services/infrastructure/ServiceModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listServicesPublic } from '@Modules/services/application/listServicesPublic';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';

const mockQB = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

describe('listServicesPublic', () => {
	it('returns paginated services', async () => {
		vi.mocked(ServiceModel.find).mockReturnValue(
			mockQB([{ id: '1', slug: 'web', _id: 'm1' }]) as never,
		);
		vi.mocked(ServiceModel.countDocuments).mockResolvedValue(1);

		const result = await listServicesPublic({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(result.meta.total).toBe(1);
	});

	it('throws when empty', async () => {
		vi.mocked(ServiceModel.find).mockReturnValue(mockQB([]) as never);
		vi.mocked(ServiceModel.countDocuments).mockResolvedValue(0);

		await expect(listServicesPublic({ page: 1, limit: 10 })).rejects.toThrow();
	});
});
