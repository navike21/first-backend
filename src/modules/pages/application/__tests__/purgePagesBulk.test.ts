import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { find: vi.fn(), deleteMany: vi.fn() },
}));
vi.mock('@Modules/pages/infrastructure/PageRevisionModel', () => ({
	default: { deleteMany: vi.fn().mockResolvedValue(undefined) },
}));
vi.mock('@Modules/storage', () => ({
	deleteEntityFiles: vi.fn().mockResolvedValue(undefined),
}));

import { purgePagesBulk } from '@Modules/pages/application/purgePagesBulk';
import PageModel from '@Modules/pages/infrastructure/PageModel';

describe('purgePagesBulk', () => {
	it('excludes pages that still have children from the purge and reports them as blocked', async () => {
		vi.mocked(PageModel.find)
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
		vi.mocked(PageModel.deleteMany).mockResolvedValue({} as never);

		const result = await purgePagesBulk(['parent-1', 'childless-1']);

		expect(result.processedIds).toEqual(['childless-1']);
		expect(result.blockedIds).toEqual(['parent-1']);
		expect(PageModel.deleteMany).toHaveBeenCalledWith({
			id: { $in: ['childless-1'] },
		});
	});

	it('reports ids not found in the trash as not found', async () => {
		vi.mocked(PageModel.find)
			.mockReturnValueOnce({ lean: vi.fn().mockResolvedValue([]) } as never)
			.mockReturnValueOnce({
				select: vi.fn().mockReturnThis(),
				lean: vi.fn().mockResolvedValue([]),
			} as never);

		const result = await purgePagesBulk(['missing-1']);

		expect(result.processedIds).toEqual([]);
		expect(result.notFoundIds).toEqual(['missing-1']);
	});
});
