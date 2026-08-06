import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock(
	'@Modules/product-categories/infrastructure/ProductCategoryModel',
	() => ({
		default: { findOne: vi.fn(), create: vi.fn() },
	}),
);

import { createProductCategory } from '@Modules/product-categories/application/createProductCategory';
import ProductCategoryModel from '@Modules/product-categories/infrastructure/ProductCategoryModel';
import { ProductCategorySlugConflictError } from '@Modules/product-categories/domain/errors/ProductCategoryErrors';

const localizedName = {
	en: 'Electronics',
	es: 'Electrónica',
	de: 'Elektronik',
	fr: 'Électronique',
	it: 'Elettronica',
	ja: '電子機器',
	ko: '전자제품',
	pt: 'Eletrônicos',
	ru: 'Электроника',
	zh: '电子产品',
};

const validInput = {
	name: localizedName,
	slug: { en: 'electronics', es: 'electronica' },
	order: 0,
	isActive: true,
};

describe('createProductCategory', () => {
	it('creates a product category and returns cleaned data', async () => {
		vi.mocked(ProductCategoryModel.findOne).mockResolvedValue(null as never);
		vi.mocked(ProductCategoryModel.create).mockResolvedValue({
			...validInput,
			id: '1',
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: '1', _id: 'mongo1' }),
		} as never);

		const result = await createProductCategory(validInput);

		expect(ProductCategoryModel.create).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws ProductCategorySlugConflictError when a category with the same slug already exists', async () => {
		vi.mocked(ProductCategoryModel.findOne).mockResolvedValue({
			id: 'existing',
		} as never);

		await expect(createProductCategory(validInput)).rejects.toThrow(
			ProductCategorySlugConflictError,
		);
	});
});
