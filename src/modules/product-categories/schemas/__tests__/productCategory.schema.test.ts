import { describe, it, expect } from 'vitest';
import {
	CreateProductCategorySchema,
	UpdateProductCategorySchema,
	ListProductCategoriesQuerySchema,
} from '@Modules/product-categories/schemas/productCategory.schema';

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

const localizedSlug = { en: 'electronics', es: 'electronica' };

const validCategory = {
	name: localizedName,
	slug: localizedSlug,
};

describe('productCategory.schema', () => {
	it('CreateProductCategorySchema parses valid minimal data', () => {
		const result = CreateProductCategorySchema.safeParse(validCategory);
		expect(result.success).toBe(true);
	});

	it('CreateProductCategorySchema allows an entirely missing slug (per-language, optional)', () => {
		const result = CreateProductCategorySchema.safeParse({
			name: localizedName,
		});
		expect(result.success).toBe(true);
	});

	it('CreateProductCategorySchema rejects a slug with uppercase letters in any language', () => {
		const result = CreateProductCategorySchema.safeParse({
			...validCategory,
			slug: { ...localizedSlug, en: 'Electronics' },
		});
		expect(result.success).toBe(false);
	});

	it('CreateProductCategorySchema rejects missing name', () => {
		const result = CreateProductCategorySchema.safeParse({
			slug: localizedSlug,
		});
		expect(result.success).toBe(false);
	});

	it('CreateProductCategorySchema defaults order to 0 and isActive to true', () => {
		const result = CreateProductCategorySchema.safeParse(validCategory);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.order).toBe(0);
			expect(result.data.isActive).toBe(true);
		}
	});

	it('CreateProductCategorySchema accepts an optional parentId', () => {
		const result = CreateProductCategorySchema.safeParse({
			...validCategory,
			parentId: '550e8400-e29b-41d4-a716-446655440000',
		});
		expect(result.success).toBe(true);
	});

	it('UpdateProductCategorySchema allows empty object', () => {
		expect(UpdateProductCategorySchema.safeParse({}).success).toBe(true);
	});

	it('UpdateProductCategorySchema allows explicitly nulling out parentId', () => {
		const result = UpdateProductCategorySchema.safeParse({ parentId: null });
		expect(result.success).toBe(true);
	});

	it('ListProductCategoriesQuerySchema defaults page and limit', () => {
		const result = ListProductCategoriesQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});
});
