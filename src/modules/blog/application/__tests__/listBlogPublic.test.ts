import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/blog/infrastructure/BlogModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listBlogPublic } from '@Modules/blog/application/listBlogPublic';
import BlogModel from '@Modules/blog/infrastructure/BlogModel';

const mockQB = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	select: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

describe('listBlogPublic', () => {
	it('returns published (and due-scheduled) posts', async () => {
		vi.mocked(BlogModel.find).mockReturnValue(
			mockQB([{ id: '1', slug: 'post', _id: 'm1' }]) as never,
		);
		vi.mocked(BlogModel.countDocuments).mockResolvedValue(1);

		const result = await listBlogPublic({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(BlogModel.find).toHaveBeenCalledWith(
			expect.objectContaining({
				deletedAt: null,
				$or: expect.arrayContaining([
					{ status: 'published' },
					expect.objectContaining({ status: 'scheduled' }),
				]),
			}),
		);
	});

	it('filters by category/tag when provided', async () => {
		vi.mocked(BlogModel.find).mockReturnValue(
			mockQB([{ id: '1', _id: 'm1' }]) as never,
		);
		vi.mocked(BlogModel.countDocuments).mockResolvedValue(1);

		const result = await listBlogPublic({
			page: 1,
			limit: 10,
			categoryId: 'cat-1',
			tagId: 'tag-1',
		});
		expect(result.data).toHaveLength(1);
	});

	it('returns empty list when no posts exist', async () => {
		vi.mocked(BlogModel.find).mockReturnValue(mockQB([]) as never);
		vi.mocked(BlogModel.countDocuments).mockResolvedValue(0);

		const result = await listBlogPublic({ page: 1, limit: 10 });
		expect(result.data).toHaveLength(0);
		expect(result.meta.total).toBe(0);
	});
});
