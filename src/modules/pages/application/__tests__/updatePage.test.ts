import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/pages/infrastructure/PageRevisionModel', () => ({
	default: { create: vi.fn().mockResolvedValue({}) },
}));
vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn().mockResolvedValue(undefined),
	deleteStorageFilesByIds: vi.fn().mockResolvedValue(undefined),
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
			slug: { en: 'home' },
			parentId: null,
			set: vi.fn(),
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', slug: { en: 'home' }, _id: 'mongo1' }),
		};
		vi.mocked(PageModel.findOne).mockResolvedValue(doc as never);

		const result = await updatePage('1', { status: 'published' }, undefined, 'user-1');

		expect(saveFn).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
	});

	it('throws PageNotFoundError when page does not exist', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue(null as never);

		await expect(updatePage('not-found', {}, undefined, 'user-1')).rejects.toThrow(PageNotFoundError);
	});

	it('throws PageSlugConflictError on duplicate sibling slug', async () => {
		const doc = { id: '1', slug: { en: 'home' }, parentId: null, set: vi.fn(), save: vi.fn() };
		const conflictDoc = { id: '2', slug: { en: 'about' } };
		vi.mocked(PageModel.findOne)
			.mockResolvedValueOnce(doc as never)
			.mockResolvedValueOnce(conflictDoc as never);

		await expect(
			updatePage('1', { slug: { en: 'about' } }, undefined, 'user-1'),
		).rejects.toThrow(PageSlugConflictError);
	});
});
