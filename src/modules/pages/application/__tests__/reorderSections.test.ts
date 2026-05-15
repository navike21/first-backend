import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));

import { reorderSections } from '@Modules/pages/application/reorderSections';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import { PageNotFoundError } from '@Modules/pages/domain/errors/PageErrors';

describe('reorderSections', () => {
	it('reorders sections and returns cleaned data', async () => {
		const sec1 = { sectionId: 'sec-1', type: 'hero', order: 0 };
		const sec2 = { sectionId: 'sec-2', type: 'gallery', order: 1 };
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			sections: [sec1, sec2],
			markModified: vi.fn(),
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', sections: [sec2, sec1], _id: 'mongo1' }),
		};
		vi.mocked(PageModel.findOne).mockResolvedValue(doc as never);

		const result = await reorderSections('home', ['sec-2', 'sec-1']);

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws PageNotFoundError when page does not exist', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue(null as never);

		await expect(reorderSections('not-found', ['sec-1'])).rejects.toThrow(
			PageNotFoundError,
		);
	});

	it('ignores section IDs not present in the page', async () => {
		const sec1 = { sectionId: 'sec-1', type: 'hero', order: 0 };
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			sections: [sec1],
			markModified: vi.fn(),
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', sections: [sec1], _id: 'mongo1' }),
		};
		vi.mocked(PageModel.findOne).mockResolvedValue(doc as never);

		const result = await reorderSections('home', ['sec-1', 'ghost-id']);

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});
});
