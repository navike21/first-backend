import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateSection } from '@Modules/pages/application/updateSection';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import {
	PageNotFoundError,
	PageSectionNotFoundError,
} from '@Modules/pages/domain/errors/PageErrors';

describe('updateSection', () => {
	it('updates section and returns cleaned data', async () => {
		const section = { sectionId: 'sec-1', type: 'hero', content: {} };
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			sections: [section],
			markModified: vi.fn(),
			save: saveFn,
			toObject: vi.fn().mockReturnValue({
				id: '1',
				sections: [section],
				_id: 'mongo1',
			}),
		};
		vi.mocked(PageModel.findOne).mockResolvedValue(doc as never);

		const result = await updateSection('home', 'sec-1', {
			content: { headline: 'New' },
		});

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws PageNotFoundError when page does not exist', async () => {
		vi.mocked(PageModel.findOne).mockResolvedValue(null as never);

		await expect(updateSection('not-found', 'sec-1', {})).rejects.toThrow(
			PageNotFoundError,
		);
	});

	it('throws PageSectionNotFoundError when section does not exist', async () => {
		const doc = {
			id: '1',
			sections: [{ sectionId: 'other-sec', type: 'hero' }],
			markModified: vi.fn(),
			save: vi.fn(),
		};
		vi.mocked(PageModel.findOne).mockResolvedValue(doc as never);

		await expect(updateSection('home', 'sec-1', {})).rejects.toThrow(
			PageSectionNotFoundError,
		);
	});
});
