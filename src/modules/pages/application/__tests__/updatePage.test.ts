import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updatePage } from '@Modules/pages/application/updatePage';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import {
	PageNotFoundError,
	PageSlugConflictError,
} from '@Modules/pages/domain/errors/PageErrors';

describe('updatePage', () => {
	it('updates and returns page', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			slug: 'home',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', slug: 'home', _id: 'mongo1' }),
		};
		vi.mocked(PageModel.findOne).mockResolvedValue(doc as never);

		const result = await updatePage('home', { isPublished: true });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws PageNotFoundError when page does not exist', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue(null as never);

		await expect(updatePage('not-found', {})).rejects.toThrow(
			PageNotFoundError,
		);
	});

	it('throws PageSlugConflictError on duplicate slug', async () => {
		const doc = { id: '1', slug: 'home', save: vi.fn() };
		const conflictDoc = { id: '2', slug: 'about' };
		vi.mocked(PageModel.findOne)
			.mockResolvedValueOnce(doc as never)
			.mockResolvedValueOnce(conflictDoc as never);

		await expect(updatePage('home', { slug: 'about' })).rejects.toThrow(
			PageSlugConflictError,
		);
	});
});
