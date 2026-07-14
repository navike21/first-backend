import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/categories/infrastructure/CategoryModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listCategories } from '@Modules/categories/application/listCategories';
import CategoryModel from '@Modules/categories/infrastructure/CategoryModel';

const mockQueryBuilder = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

const category = { id: '1', slug: 'news', status: 'active', _id: 'mongo1' };

describe('listCategories', () => {
	it('uses the active+isActive+deletedAt filter for the public view', async () => {
		vi.mocked(CategoryModel.find).mockReturnValue(
			mockQueryBuilder([category]) as never,
		);
		vi.mocked(CategoryModel.countDocuments).mockResolvedValue(1);

		await listCategories({ page: 1, limit: 10, adminView: false });

		expect(CategoryModel.find).toHaveBeenCalledWith({
			status: 'active',
			isActive: true,
			deletedAt: null,
		});
	});

	it('uses the deletedAt null filter for adminView', async () => {
		vi.mocked(CategoryModel.find).mockReturnValue(
			mockQueryBuilder([category]) as never,
		);
		vi.mocked(CategoryModel.countDocuments).mockResolvedValue(1);

		const result = await listCategories({
			page: 1,
			limit: 10,
			adminView: true,
		});

		expect(CategoryModel.find).toHaveBeenCalledWith({ deletedAt: null });
		expect(result.data[0]).not.toHaveProperty('_id');
	});

	it('filters by parentId when provided', async () => {
		vi.mocked(CategoryModel.find).mockReturnValue(
			mockQueryBuilder([category]) as never,
		);
		vi.mocked(CategoryModel.countDocuments).mockResolvedValue(1);

		await listCategories({
			page: 1,
			limit: 10,
			adminView: true,
			parentId: 'parent-1',
		});

		expect(CategoryModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ parentId: 'parent-1' }),
		);
	});
});
