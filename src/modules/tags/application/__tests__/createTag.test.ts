import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/tags/infrastructure/TagModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

import { createTag } from '@Modules/tags/application/createTag';
import TagModel from '@Modules/tags/infrastructure/TagModel';
import { TagSlugConflictError } from '@Modules/tags/domain/errors/TagErrors';

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

const validInput = {
	name: localizedName,
	slug: 'featured',
	order: 0,
	isActive: true,
};

describe('createTag', () => {
	it('creates a tag and returns cleaned data', async () => {
		vi.mocked(TagModel.findOne).mockResolvedValue(null as never);
		vi.mocked(TagModel.create).mockResolvedValue({
			...validInput,
			id: '1',
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: '1', _id: 'mongo1' }),
		} as never);

		const result = await createTag(validInput);

		expect(TagModel.create).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws TagSlugConflictError when a tag with the same slug already exists', async () => {
		vi.mocked(TagModel.findOne).mockResolvedValue({ id: 'existing' } as never);

		await expect(createTag(validInput)).rejects.toThrow(TagSlugConflictError);
	});
});
