import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));

import { deletePage } from '@Modules/pages/application/deletePage';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import { PageNotFoundError } from '@Modules/pages/domain/errors/PageErrors';

describe('deletePage', () => {
	it('soft-deletes page and returns data', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			slug: { en: 'home' },
			status: 'published',
			deletedAt: undefined as Date | undefined,
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', status: 'published', _id: 'mongo1' }),
		};
		vi.mocked(PageModel.findOne).mockResolvedValue(doc as never);

		const result = await deletePage('1');

		expect(saveFn).toHaveBeenCalled();
		// Soft-delete is recorded via deletedAt (there is no 'deleted' status).
		expect(doc.deletedAt).toBeInstanceOf(Date);
		expect(result).not.toHaveProperty('_id');
	});

	it('throws PageNotFoundError when page does not exist', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue(null as never);

		await expect(deletePage('not-found')).rejects.toThrow(PageNotFoundError);
	});
});
