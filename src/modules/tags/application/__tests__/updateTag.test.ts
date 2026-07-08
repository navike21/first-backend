import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/tags/infrastructure/TagModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateTag } from '@Modules/tags/application/updateTag';
import TagModel from '@Modules/tags/infrastructure/TagModel';
import { TagNotFoundError, TagSlugConflictError } from '@Modules/tags/domain/errors/TagErrors';

describe('updateTag', () => {
	it('updates and returns the tag', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			slug: 'featured',
			save: saveFn,
			toObject: vi.fn().mockReturnValue({ id: '1', slug: 'featured', _id: 'mongo1' }),
		};
		vi.mocked(TagModel.findOne).mockResolvedValue(doc as never);

		const result = await updateTag('1', { order: 2 });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws TagNotFoundError when the tag does not exist', async () => {
		vi.mocked(TagModel.findOne).mockResolvedValue(null as never);

		await expect(updateTag('missing', {})).rejects.toThrow(TagNotFoundError);
	});

	it('throws TagSlugConflictError on duplicate slug', async () => {
		const doc = { id: '1', slug: 'featured', save: vi.fn() };
		const conflictDoc = { id: '2', slug: 'popular' };
		vi.mocked(TagModel.findOne)
			.mockResolvedValueOnce(doc as never)
			.mockResolvedValueOnce(conflictDoc as never);

		await expect(updateTag('1', { slug: 'popular' })).rejects.toThrow(TagSlugConflictError);
	});
});
