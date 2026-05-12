import { describe, it, expect } from 'vitest';
import {
	CreatePageSchema,
	UpdatePageSchema,
	CreateSectionSchema,
	UpdateSectionSchema,
	ReorderSectionsSchema,
	ListPagesQuerySchema,
} from '@Modules/pages/schemas/page.schema';

const localizedName = {
	en: 'Home',
	es: 'Inicio',
	de: 'Startseite',
	fr: 'Accueil',
	it: 'Home',
	ja: 'ホーム',
	ko: '홈',
	pt: 'Início',
	ru: 'Главная',
	zh: '首页',
};

const validPage = {
	slug: 'home-page',
	title: localizedName,
};

describe('page.schema', () => {
	it('CreatePageSchema parses valid minimal data', () => {
		const result = CreatePageSchema.safeParse(validPage);
		expect(result.success).toBe(true);
	});

	it('CreatePageSchema rejects missing slug', () => {
		const result = CreatePageSchema.safeParse({ title: localizedName });
		expect(result.success).toBe(false);
	});

	it('CreatePageSchema rejects slug with uppercase letters', () => {
		const result = CreatePageSchema.safeParse({
			...validPage,
			slug: 'Home-Page',
		});
		expect(result.success).toBe(false);
	});

	it('CreatePageSchema rejects slug with spaces', () => {
		const result = CreatePageSchema.safeParse({
			...validPage,
			slug: 'home page',
		});
		expect(result.success).toBe(false);
	});

	it('CreatePageSchema accepts slug with dashes and numbers', () => {
		const result = CreatePageSchema.safeParse({
			...validPage,
			slug: 'about-us-2024',
		});
		expect(result.success).toBe(true);
	});

	it('CreatePageSchema rejects missing title', () => {
		const result = CreatePageSchema.safeParse({ slug: 'home' });
		expect(result.success).toBe(false);
	});

	it('CreatePageSchema defaults isPublished to false', () => {
		const result = CreatePageSchema.safeParse(validPage);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.isPublished).toBe(false);
	});

	it('UpdatePageSchema allows partial data', () => {
		const result = UpdatePageSchema.safeParse({ isPublished: true });
		expect(result.success).toBe(true);
	});

	it('UpdatePageSchema allows empty object', () => {
		const result = UpdatePageSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('CreateSectionSchema parses valid section', () => {
		const result = CreateSectionSchema.safeParse({
			type: 'hero',
			content: { headline: 'Welcome' },
		});
		expect(result.success).toBe(true);
	});

	it('CreateSectionSchema rejects invalid type', () => {
		const result = CreateSectionSchema.safeParse({ type: 'unknown-type' });
		expect(result.success).toBe(false);
	});

	it('CreateSectionSchema defaults order to 0 and content to empty object', () => {
		const result = CreateSectionSchema.safeParse({ type: 'gallery' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.order).toBe(0);
			expect(result.data.content).toEqual({});
		}
	});

	it('UpdateSectionSchema allows partial update', () => {
		const result = UpdateSectionSchema.safeParse({
			content: { items: [] },
		});
		expect(result.success).toBe(true);
	});

	it('ReorderSectionsSchema requires non-empty order array', () => {
		expect(ReorderSectionsSchema.safeParse({ order: [] }).success).toBe(false);
		expect(
			ReorderSectionsSchema.safeParse({ order: ['id-1', 'id-2'] }).success,
		).toBe(true);
	});

	it('ListPagesQuerySchema defaults page and limit', () => {
		const result = ListPagesQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});

	it('ListPagesQuerySchema coerces string to number', () => {
		const result = ListPagesQuerySchema.safeParse({ page: '3', limit: '25' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(3);
			expect(result.data.limit).toBe(25);
		}
	});
});
