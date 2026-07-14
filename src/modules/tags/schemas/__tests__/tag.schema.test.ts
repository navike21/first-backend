import { describe, it, expect } from 'vitest';
import {
	CreateTagSchema,
	UpdateTagSchema,
	ListTagsQuerySchema,
} from '@Modules/tags/schemas/tag.schema';

const localizedName = {
	en: 'Featured',
	es: 'Destacado',
	de: 'Empfohlen',
	fr: 'En vedette',
	it: 'In evidenza',
	ja: '注目',
	ko: '추천',
	pt: 'Destaque',
	ru: 'Рекомендуемое',
	zh: '精选',
};

const validTag = { name: localizedName, slug: 'featured' };

describe('tag.schema', () => {
	it('CreateTagSchema parses valid minimal data', () => {
		expect(CreateTagSchema.safeParse(validTag).success).toBe(true);
	});

	it('CreateTagSchema rejects missing slug', () => {
		expect(CreateTagSchema.safeParse({ name: localizedName }).success).toBe(
			false,
		);
	});

	it('CreateTagSchema rejects slug with uppercase letters', () => {
		expect(
			CreateTagSchema.safeParse({ ...validTag, slug: 'Featured' }).success,
		).toBe(false);
	});

	it('CreateTagSchema rejects missing name', () => {
		expect(CreateTagSchema.safeParse({ slug: 'featured' }).success).toBe(false);
	});

	it('CreateTagSchema defaults order to 0 and isActive to true', () => {
		const result = CreateTagSchema.safeParse(validTag);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.order).toBe(0);
			expect(result.data.isActive).toBe(true);
		}
	});

	it('UpdateTagSchema allows empty object', () => {
		expect(UpdateTagSchema.safeParse({}).success).toBe(true);
	});

	it('ListTagsQuerySchema defaults page and limit', () => {
		const result = ListTagsQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});
});
