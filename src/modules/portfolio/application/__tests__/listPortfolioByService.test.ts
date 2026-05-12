import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));
vi.mock('@Modules/services/infrastructure/ServiceModel', () => ({
	default: { findOne: vi.fn() },
}));

import { listPortfolioByService } from '@Modules/portfolio/application/listPortfolioByService';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';

const mockQB = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	select: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

describe('listPortfolioByService', () => {
	it('returns portfolio items for a service', async () => {
		vi.mocked(ServiceModel.findOne).mockReturnValue({ lean: vi.fn().mockResolvedValue({ id: 'svc-1', slug: 'web' }) } as never);
		vi.mocked(PortfolioModel.find).mockReturnValue(mockQB([{ id: '1', slug: 'proj', _id: 'm1' }]) as never);
		vi.mocked(PortfolioModel.countDocuments).mockResolvedValue(1);

		const result = await listPortfolioByService({ serviceSlug: 'web', page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
	});

	it('throws when service not found', async () => {
		vi.mocked(ServiceModel.findOne).mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as never);

		await expect(listPortfolioByService({ serviceSlug: 'missing', page: 1, limit: 10 })).rejects.toThrow();
	});

	it('throws when portfolio list empty for service', async () => {
		vi.mocked(ServiceModel.findOne).mockReturnValue({ lean: vi.fn().mockResolvedValue({ id: 'svc-1' }) } as never);
		vi.mocked(PortfolioModel.find).mockReturnValue(mockQB([]) as never);
		vi.mocked(PortfolioModel.countDocuments).mockResolvedValue(0);

		await expect(listPortfolioByService({ serviceSlug: 'web', page: 1, limit: 10 })).rejects.toThrow();
	});
});
