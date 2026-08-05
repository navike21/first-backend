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

const localizedSlug = { en: 'featured', es: 'destacado' };

const validTag = { name: localizedName, slug: localizedSlug };

describe('tag.schema', () => {
	it('CreateTagSchema parses valid minimal data', () => {
		expect(CreateTagSchema.safeParse(validTag).success).toBe(true);
	});

	it('CreateTagSchema allows an entirely missing slug (per-language, optional)', () => {
		expect(CreateTagSchema.safeParse({ name: localizedName }).success).toBe(
			true,
		);
	});

	it('CreateTagSchema rejects a slug with uppercase letters in any language', () => {
		expect(
			CreateTagSchema.safeParse({
				...validTag,
				slug: { ...localizedSlug, en: 'Featured' },
			}).success,
		).toBe(false);
	});

	it('CreateTagSchema rejects missing name', () => {
		expect(CreateTagSchema.safeParse({ slug: localizedSlug }).success).toBe(
			false,
		);
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
