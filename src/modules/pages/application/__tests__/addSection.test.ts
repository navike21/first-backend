import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));

import { addSection } from '@Modules/pages/application/addSection';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import { PageNotFoundError } from '@Modules/pages/domain/errors/PageErrors';

describe('addSection', () => {
	it('adds section to page and returns cleaned data', async () => {
		const pushFn = vi.fn();
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			slug: 'home',
			sections: { push: pushFn },
			markModified: vi.fn(),
			save: saveFn,
			toObject: vi.fn().mockReturnValue({
				id: '1',
				slug: 'home',
				sections: [],
				_id: 'mongo1',
			}),
		};
		vi.mocked(PageModel.findOne).mockResolvedValue(doc as never);

		const result = await addSection('home', {
			type: 'hero',
			order: 0,
			content: {},
		});

		expect(pushFn).toHaveBeenCalled();
		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws PageNotFoundError when page does not exist', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue(null as never);

		await expect(
			addSection('not-found', { type: 'hero', order: 0, content: {} }),
		).rejects.toThrow(PageNotFoundError);
	});
});
