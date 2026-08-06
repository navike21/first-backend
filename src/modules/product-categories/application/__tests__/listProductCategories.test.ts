import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock(
	'@Modules/product-categories/infrastructure/ProductCategoryModel',
	() => ({
		default: { find: vi.fn(), countDocuments: vi.fn() },
	}),
);

import { listProductCategories } from '@Modules/product-categories/application/listProductCategories';
import ProductCategoryModel from '@Modules/product-categories/infrastructure/ProductCategoryModel';

const mockQueryBuilder = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

const category = {
	id: '1',
	slug: 'electronics',
	status: 'active',
	_id: 'mongo1',
};

describe('listProductCategories', () => {
	it('uses the active+isActive+deletedAt filter for the public view', async () => {
		vi.mocked(ProductCategoryModel.find).mockReturnValue(
			mockQueryBuilder([category]) as never,
		);
		vi.mocked(ProductCategoryModel.countDocuments).mockResolvedValue(1);

		await listProductCategories({ page: 1, limit: 10, adminView: false });

		expect(ProductCategoryModel.find).toHaveBeenCalledWith({
			status: 'active',
			isActive: true,
			deletedAt: null,
		});
	});

	it('uses the deletedAt null filter for adminView', async () => {
		vi.mocked(ProductCategoryModel.find).mockReturnValue(
			mockQueryBuilder([category]) as never,
		);
		vi.mocked(ProductCategoryModel.countDocuments).mockResolvedValue(1);

		const result = await listProductCategories({
			page: 1,
			limit: 10,
			adminView: true,
		});

		expect(ProductCategoryModel.find).toHaveBeenCalledWith({
			deletedAt: null,
		});
		expect(result.data[0]).not.toHaveProperty('_id');
	});

	it('filters by parentId when provided', async () => {
		vi.mocked(ProductCategoryModel.find).mockReturnValue(
			mockQueryBuilder([category]) as never,
		);
		vi.mocked(ProductCategoryModel.countDocuments).mockResolvedValue(1);

		await listProductCategories({
			page: 1,
			limit: 10,
			adminView: true,
			parentId: 'parent-1',
		});

		expect(ProductCategoryModel.find).toHaveBeenCalledWith(
			expect.objectContaining({ parentId: 'parent-1' }),
		);
	});
});
