import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listPortfolioPublic } from '@Modules/portfolio/application/listPortfolioPublic';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';

const mockQB = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	select: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

describe('listPortfolioPublic', () => {
	it('returns paginated portfolio items', async () => {
		vi.mocked(PortfolioModel.find).mockReturnValue(mockQB([{ id: '1', slug: 'proj', _id: 'm1' }]) as never);
		vi.mocked(PortfolioModel.countDocuments).mockResolvedValue(1);

		const result = await listPortfolioPublic({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(result.meta.total).toBe(1);
	});

	it('applies featured filter', async () => {
		vi.mocked(PortfolioModel.find).mockReturnValue(mockQB([{ id: '1', _id: 'm1' }]) as never);
		vi.mocked(PortfolioModel.countDocuments).mockResolvedValue(1);

		const result = await listPortfolioPublic({ page: 1, limit: 10, featured: true });
		expect(result.data).toHaveLength(1);
	});

	it('throws when empty', async () => {
		vi.mocked(PortfolioModel.find).mockReturnValue(mockQB([]) as never);
		vi.mocked(PortfolioModel.countDocuments).mockResolvedValue(0);

		await expect(listPortfolioPublic({ page: 1, limit: 10 })).rejects.toThrow();
	});
});
