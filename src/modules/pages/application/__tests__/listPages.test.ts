import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listPages } from '@Modules/pages/application/listPages';
import PageModel from '@Modules/pages/infrastructure/PageModel';

const mockQueryBuilder = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

const page = { id: '1', slug: 'home', status: 'published', _id: 'mongo1' };

describe('listPages', () => {
	it('returns paginated public pages', async () => {
		vi.mocked(PageModel.find).mockReturnValue(
			mockQueryBuilder([page]) as never,
		);
		vi.mocked(PageModel.countDocuments).mockResolvedValue(1);

		const result = await listPages({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(result.data[0]).not.toHaveProperty('_id');
		expect(result.meta.total).toBe(1);
	});

	it('uses the deletedAt null filter for adminView', async () => {
		vi.mocked(PageModel.find).mockReturnValue(
			mockQueryBuilder([page]) as never,
		);
		vi.mocked(PageModel.countDocuments).mockResolvedValue(1);

		await listPages({ page: 1, limit: 10, adminView: true });

		expect(PageModel.find).toHaveBeenCalledWith({
			deletedAt: null,
		});
	});

	it('uses published + isPublished + deletedAt filter for public view', async () => {
		vi.mocked(PageModel.find).mockReturnValue(
			mockQueryBuilder([page]) as never,
		);
		vi.mocked(PageModel.countDocuments).mockResolvedValue(1);

		await listPages({ page: 1, limit: 10, adminView: false });

		expect(PageModel.find).toHaveBeenCalledWith({
			status: 'published',
			isPublished: true,
			deletedAt: null,
		});
	});

	it('returns correct meta pagination', async () => {
		vi.mocked(PageModel.find).mockReturnValue(
			mockQueryBuilder([page]) as never,
		);
		vi.mocked(PageModel.countDocuments).mockResolvedValue(30);

		const result = await listPages({ page: 2, limit: 10 });

		expect(result.meta.totalPages).toBe(3);
	});
});
