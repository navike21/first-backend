import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/categories/infrastructure/CategoryModel', () => ({
	default: { findOne: vi.fn(), exists: vi.fn(), deleteOne: vi.fn() },
}));

import { purgeCategory } from '@Modules/categories/application/purgeCategory';
import CategoryModel from '@Modules/categories/infrastructure/CategoryModel';
import { CategoryHasChildrenError } from '@Modules/categories/domain/errors/CategoryErrors';

describe('purgeCategory', () => {
	it('throws CategoryHasChildrenError when the category still has non-deleted children', async () => {
		vi.mocked(CategoryModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'cat-1', deletedAt: new Date() }),
		} as never);
		vi.mocked(CategoryModel.exists).mockResolvedValue({ _id: 'child-1' } as never);

		await expect(purgeCategory('cat-1')).rejects.toThrow(CategoryHasChildrenError);
		expect(CategoryModel.deleteOne).not.toHaveBeenCalled();
	});

	it('permanently deletes a childless category', async () => {
		vi.mocked(CategoryModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ id: 'cat-1', deletedAt: new Date() }),
		} as never);
		vi.mocked(CategoryModel.exists).mockResolvedValue(null as never);
		vi.mocked(CategoryModel.deleteOne).mockResolvedValue({} as never);

		const result = await purgeCategory('cat-1');

		expect(CategoryModel.deleteOne).toHaveBeenCalledWith({ id: 'cat-1' });
		expect(result).not.toHaveProperty('_id');
	});
});
