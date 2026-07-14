import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/categories/infrastructure/CategoryModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateCategory } from '@Modules/categories/application/updateCategory';
import CategoryModel from '@Modules/categories/infrastructure/CategoryModel';
import {
	CategoryNotFoundError,
	CategorySlugConflictError,
} from '@Modules/categories/domain/errors/CategoryErrors';

describe('updateCategory', () => {
	it('updates and returns the category', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			slug: 'news',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', slug: 'news', _id: 'mongo1' }),
		};
		vi.mocked(CategoryModel.findOne).mockResolvedValue(doc as never);

		const result = await updateCategory('1', { order: 2 });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws CategoryNotFoundError when the category does not exist', async () => {
		vi.mocked(CategoryModel.findOne).mockResolvedValue(null as never);

		await expect(updateCategory('missing', {})).rejects.toThrow(
			CategoryNotFoundError,
		);
	});

	it('throws CategorySlugConflictError on duplicate slug', async () => {
		const doc = { id: '1', slug: 'news', save: vi.fn() };
		const conflictDoc = { id: '2', slug: 'events' };
		vi.mocked(CategoryModel.findOne)
			.mockResolvedValueOnce(doc as never)
			.mockResolvedValueOnce(conflictDoc as never);

		await expect(updateCategory('1', { slug: 'events' })).rejects.toThrow(
			CategorySlugConflictError,
		);
	});
});
