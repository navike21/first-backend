import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock(
	'@Modules/product-categories/infrastructure/ProductCategoryModel',
	() => ({
		default: { findOne: vi.fn(), exists: vi.fn(), deleteOne: vi.fn() },
	}),
);

import { purgeProductCategory } from '@Modules/product-categories/application/purgeProductCategory';
import ProductCategoryModel from '@Modules/product-categories/infrastructure/ProductCategoryModel';
import { ProductCategoryHasChildrenError } from '@Modules/product-categories/domain/errors/ProductCategoryErrors';

describe('purgeProductCategory', () => {
	it('throws ProductCategoryHasChildrenError when the category still has non-deleted children', async () => {
		vi.mocked(ProductCategoryModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'cat-1', deletedAt: new Date() }),
		} as never);
		vi.mocked(ProductCategoryModel.exists).mockResolvedValue({
			_id: 'child-1',
		} as never);

		await expect(purgeProductCategory('cat-1')).rejects.toThrow(
			ProductCategoryHasChildrenError,
		);
		expect(ProductCategoryModel.deleteOne).not.toHaveBeenCalled();
	});

	it('permanently deletes a childless category', async () => {
		vi.mocked(ProductCategoryModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'cat-1', deletedAt: new Date() }),
		} as never);
		vi.mocked(ProductCategoryModel.exists).mockResolvedValue(null as never);
		vi.mocked(ProductCategoryModel.deleteOne).mockResolvedValue({} as never);

		const result = await purgeProductCategory('cat-1');

		expect(ProductCategoryModel.deleteOne).toHaveBeenCalledWith({
			id: 'cat-1',
		});
		expect(result).not.toHaveProperty('_id');
	});
});
