import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/categories/infrastructure/CategoryModel', () => ({
	default: { find: vi.fn(), deleteMany: vi.fn() },
}));

import { purgeCategoriesBulk } from '@Modules/categories/application/purgeCategoriesBulk';
import CategoryModel from '@Modules/categories/infrastructure/CategoryModel';

describe('purgeCategoriesBulk', () => {
	it('excludes categories that still have children and reports them as blocked', async () => {
		vi.mocked(CategoryModel.find)
			.mockReturnValueOnce({
				lean: vi.fn().mockResolvedValue([
					{ id: 'parent-1', deletedAt: new Date() },
					{ id: 'childless-1', deletedAt: new Date() },
				]),
			} as never)
			.mockReturnValueOnce({
				select: vi.fn().mockReturnThis(),
				lean: vi.fn().mockResolvedValue([{ parentId: 'parent-1' }]),
			} as never);
		vi.mocked(CategoryModel.deleteMany).mockResolvedValue({} as never);

		const result = await purgeCategoriesBulk(['parent-1', 'childless-1']);

		expect(result.processedIds).toEqual(['childless-1']);
		expect(result.blockedIds).toEqual(['parent-1']);
		expect(CategoryModel.deleteMany).toHaveBeenCalledWith({
			id: { $in: ['childless-1'] },
		});
	});
});
