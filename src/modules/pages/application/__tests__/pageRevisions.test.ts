import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn(), find: vi.fn(), updateOne: vi.fn() },
}));
vi.mock('@Modules/pages/infrastructure/PageRevisionModel', () => ({
	default: { create: vi.fn(), find: vi.fn(), findOne: vi.fn() },
}));

import {
	recordPageRevision,
	listPageRevisions,
	restorePageRevision,
} from '@Modules/pages/application/pageRevisions';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import PageRevisionModel from '@Modules/pages/infrastructure/PageRevisionModel';
import {
	PageNotFoundError,
	PageRevisionNotFoundError,
} from '@Modules/pages/domain/errors/PageErrors';

describe('recordPageRevision', () => {
	it('stores a cleaned snapshot for the page', async () => {
		vi.mocked(PageRevisionModel.create).mockResolvedValue({} as never);

		await recordPageRevision(
			'page-1',
			{ title: { en: 'Home' }, _id: 'mongo1' },
			'user-1',
		);

		expect(PageRevisionModel.create).toHaveBeenCalledWith({
			pageId: 'page-1',
			snapshot: { title: { en: 'Home' } },
			createdBy: 'user-1',
		});
	});
});

describe('listPageRevisions', () => {
	it('throws PageNotFoundError when the page does not exist', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);

		await expect(listPageRevisions('missing')).rejects.toThrow(
			PageNotFoundError,
		);
	});

	it('returns cleaned revisions sorted by newest first', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'page-1' }),
		} as never);
		vi.mocked(PageRevisionModel.find).mockReturnValue({
			sort: vi.fn().mockReturnThis(),
			lean: vi.fn().mockResolvedValue([{ id: 'rev-1', _id: 'mongo1' }]),
		} as never);

		const result = await listPageRevisions('page-1');

		expect(result).toEqual([{ id: 'rev-1' }]);
	});
});

describe('restorePageRevision', () => {
	it('throws PageNotFoundError when the page does not exist', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValueOnce(null as never);

		await expect(
			restorePageRevision('missing', 'rev-1', 'user-1'),
		).rejects.toThrow(PageNotFoundError);
	});

	it('throws PageRevisionNotFoundError when the revision does not exist', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValueOnce({
			id: 'page-1',
		} as never);
		vi.mocked(PageRevisionModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);

		await expect(
			restorePageRevision('page-1', 'missing-rev', 'user-1'),
		).rejects.toThrow(PageRevisionNotFoundError);
	});

	it('applies the snapshot fields, saves, and records a new revision', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: 'page-1',
			set: vi.fn(),
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: 'page-1', title: { en: 'Restored' } }),
		};
		vi.mocked(PageModel.findOne).mockResolvedValueOnce(doc as never);
		vi.mocked(PageRevisionModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({
				id: 'rev-1',
				pageId: 'page-1',
				snapshot: { title: { en: 'Restored' }, parentId: null, slug: {} },
			}),
		} as never);
		vi.mocked(PageModel.find).mockReturnValue({
			select: vi.fn().mockReturnThis(),
			lean: vi.fn().mockResolvedValue([]),
		} as never);
		vi.mocked(PageRevisionModel.create).mockResolvedValue({} as never);

		const result = await restorePageRevision('page-1', 'rev-1', 'user-2');

		expect(saveFn).toHaveBeenCalled();
		expect(doc.updatedBy).toBe('user-2');
		expect(PageRevisionModel.create).toHaveBeenCalled();
		expect(result).toEqual({ id: 'page-1', title: { en: 'Restored' } });
	});
});
