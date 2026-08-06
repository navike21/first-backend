import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock(
	'@Modules/product-categories/infrastructure/ProductCategoryModel',
	() => ({
		default: { find: vi.fn(), deleteMany: vi.fn() },
	}),
);

import { purgeProductCategoriesBulk } from '@Modules/product-categories/application/purgeProductCategoriesBulk';
import ProductCategoryModel from '@Modules/product-categories/infrastructure/ProductCategoryModel';

describe('purgeProductCategoriesBulk', () => {
	it('excludes categories that still have children and reports them as blocked', async () => {
		vi.mocked(ProductCategoryModel.find)
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
		vi.mocked(ProductCategoryModel.deleteMany).mockResolvedValue({} as never);

		const result = await purgeProductCategoriesBulk([
			'parent-1',
			'childless-1',
		]);

		expect(result.processedIds).toEqual(['childless-1']);
		expect(result.blockedIds).toEqual(['parent-1']);
		expect(ProductCategoryModel.deleteMany).toHaveBeenCalledWith({
			id: { $in: ['childless-1'] },
		});
	});
});
