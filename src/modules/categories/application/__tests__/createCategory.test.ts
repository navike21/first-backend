import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/categories/infrastructure/CategoryModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

import { createCategory } from '@Modules/categories/application/createCategory';
import CategoryModel from '@Modules/categories/infrastructure/CategoryModel';
import { CategorySlugConflictError } from '@Modules/categories/domain/errors/CategoryErrors';

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

const validInput = {
	name: localizedName,
	slug: 'news',
	order: 0,
	isActive: true,
};

describe('createCategory', () => {
	it('creates a category and returns cleaned data', async () => {
		vi.mocked(CategoryModel.findOne).mockResolvedValue(null as never);
		vi.mocked(CategoryModel.create).mockResolvedValue({
			...validInput,
			id: '1',
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: '1', _id: 'mongo1' }),
		} as never);

		const result = await createCategory(validInput);

		expect(CategoryModel.create).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws CategorySlugConflictError when a category with the same slug already exists', async () => {
		vi.mocked(CategoryModel.findOne).mockResolvedValue({
			id: 'existing',
		} as never);

		await expect(createCategory(validInput)).rejects.toThrow(
			CategorySlugConflictError,
		);
	});
});
