import { describe, it, expect } from 'vitest';
import {
	CreateCategorySchema,
	UpdateCategorySchema,
	ListCategoriesQuerySchema,
} from '@Modules/categories/schemas/category.schema';

const localizedName = {
	en: 'News',
	es: 'Noticias',
	de: 'Nachrichten',
	fr: 'Actualités',
	it: 'Notizie',
	ja: 'ニュース',
	ko: '뉴스',
	pt: 'Notícias',
	ru: 'Новости',
	zh: '新闻',
};

const validCategory = {
	name: localizedName,
	slug: 'news',
};

describe('category.schema', () => {
	it('CreateCategorySchema parses valid minimal data', () => {
		const result = CreateCategorySchema.safeParse(validCategory);
		expect(result.success).toBe(true);
	});

	it('CreateCategorySchema rejects missing slug', () => {
		const result = CreateCategorySchema.safeParse({ name: localizedName });
		expect(result.success).toBe(false);
	});

	it('CreateCategorySchema rejects slug with uppercase letters', () => {
		const result = CreateCategorySchema.safeParse({ ...validCategory, slug: 'News' });
		expect(result.success).toBe(false);
	});

	it('CreateCategorySchema rejects missing name', () => {
		const result = CreateCategorySchema.safeParse({ slug: 'news' });
		expect(result.success).toBe(false);
	});

	it('CreateCategorySchema defaults order to 0 and isActive to true', () => {
		const result = CreateCategorySchema.safeParse(validCategory);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.order).toBe(0);
			expect(result.data.isActive).toBe(true);
		}
	});

	it('CreateCategorySchema accepts an optional parentId', () => {
		const result = CreateCategorySchema.safeParse({
			...validCategory,
			parentId: '550e8400-e29b-41d4-a716-446655440000',
		});
		expect(result.success).toBe(true);
	});

	it('UpdateCategorySchema allows empty object', () => {
		expect(UpdateCategorySchema.safeParse({}).success).toBe(true);
	});

	it('UpdateCategorySchema allows explicitly nulling out parentId', () => {
		const result = UpdateCategorySchema.safeParse({ parentId: null });
		expect(result.success).toBe(true);
	});

	it('ListCategoriesQuerySchema defaults page and limit', () => {
		const result = ListCategoriesQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});
});
