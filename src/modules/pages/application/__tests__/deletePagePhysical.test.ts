import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn(), exists: vi.fn(), deleteOne: vi.fn() },
}));
vi.mock('@Modules/pages/infrastructure/PageRevisionModel', () => ({
	default: { deleteMany: vi.fn().mockResolvedValue(undefined) },
}));
vi.mock('@Modules/storage', () => ({
	deleteEntityFiles: vi.fn().mockResolvedValue(undefined),
}));

import { deletePagePhysical } from '@Modules/pages/application/deletePagePhysical';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import { PageHasChildrenError } from '@Modules/pages/domain/errors/PageErrors';

describe('deletePagePhysical', () => {
	it('throws PageHasChildrenError when the page still has non-deleted children', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'page-1', deletedAt: new Date() }),
		} as never);
		vi.mocked(PageModel.exists).mockResolvedValue({ _id: 'child-1' } as never);

		await expect(deletePagePhysical('page-1')).rejects.toThrow(PageHasChildrenError);
		expect(PageModel.deleteOne).not.toHaveBeenCalled();
	});

	it('permanently deletes a childless page and its revisions/files', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'page-1', deletedAt: new Date() }),
		} as never);
		vi.mocked(PageModel.exists).mockResolvedValue(null as never);
		vi.mocked(PageModel.deleteOne).mockResolvedValue({} as never);

		const result = await deletePagePhysical('page-1');

		expect(PageModel.deleteOne).toHaveBeenCalledWith({ id: 'page-1' });
		expect(result).not.toHaveProperty('_id');
	});
});
