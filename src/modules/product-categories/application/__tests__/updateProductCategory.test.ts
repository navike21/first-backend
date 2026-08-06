import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock(
	'@Modules/product-categories/infrastructure/ProductCategoryModel',
	() => ({
		default: { findOne: vi.fn() },
	}),
);

import { updateProductCategory } from '@Modules/product-categories/application/updateProductCategory';
import ProductCategoryModel from '@Modules/product-categories/infrastructure/ProductCategoryModel';
import {
	ProductCategoryNotFoundError,
	ProductCategorySlugConflictError,
} from '@Modules/product-categories/domain/errors/ProductCategoryErrors';

describe('updateProductCategory', () => {
	it('updates and returns the category', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			slug: { en: 'electronics' },
			save: saveFn,
			toObject: vi.fn().mockReturnValue({
				id: '1',
				slug: { en: 'electronics' },
				_id: 'mongo1',
			}),
		};
		vi.mocked(ProductCategoryModel.findOne).mockResolvedValue(doc as never);

		const result = await updateProductCategory('1', { order: 2 });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws ProductCategoryNotFoundError when the category does not exist', async () => {
		vi.mocked(ProductCategoryModel.findOne).mockResolvedValue(null as never);

		await expect(updateProductCategory('missing', {})).rejects.toThrow(
			ProductCategoryNotFoundError,
		);
	});

	it('throws ProductCategorySlugConflictError on duplicate slug', async () => {
		const doc = { id: '1', slug: { en: 'electronics' }, save: vi.fn() };
		const conflictDoc = { id: '2', slug: { en: 'appliances' } };
		vi.mocked(ProductCategoryModel.findOne)
			.mockResolvedValueOnce(doc as never)
			.mockResolvedValueOnce(conflictDoc as never);

		await expect(
			updateProductCategory('1', { slug: { en: 'appliances' } }),
		).rejects.toThrow(ProductCategorySlugConflictError);
	});
});
