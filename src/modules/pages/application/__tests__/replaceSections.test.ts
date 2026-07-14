import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/pages/infrastructure/PageRevisionModel', () => ({
	default: { create: vi.fn() },
}));

import PageModel from '@Modules/pages/infrastructure/PageModel';
import PageRevisionModel from '@Modules/pages/infrastructure/PageRevisionModel';
import { replaceSections } from '../replaceSections';
import { PageNotFoundError } from '../../domain/errors/PageErrors';

const findOneMock = PageModel.findOne as unknown as ReturnType<typeof vi.fn>;
const revisionCreateMock = PageRevisionModel.create as unknown as ReturnType<
	typeof vi.fn
>;

function fakeDoc() {
	const doc: Record<string, unknown> = {
		id: 'page-1',
		sections: [],
		markModified: vi.fn(),
		save: vi.fn().mockResolvedValue(undefined),
	};
	doc.toObject = () => ({ id: 'page-1', sections: doc.sections });
	return doc;
}

describe('replaceSections', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('throws PageNotFoundError when the page does not exist', async () => {
		findOneMock.mockResolvedValue(null);

		await expect(
			replaceSections('missing', { sections: [] }, 'u1'),
		).rejects.toThrow(PageNotFoundError);
	});

	it('assigns sectionId to new sections and normalizes order by index', async () => {
		const doc = fakeDoc();
		findOneMock.mockResolvedValue(doc);

		await replaceSections(
			'page-1',
			{
				sections: [
					{
						type: 'columns',
						order: 99,
						settings: { columns: 2 },
						content: { columns: [] },
					},
					{
						sectionId: '11111111-1111-4111-8111-111111111111',
						type: 'columns',
						order: 0,
						settings: { columns: 1 },
						content: { columns: [] },
					},
				],
			},
			'u1',
		);

		const saved = doc.sections as Array<{ sectionId: string; order: number }>;
		expect(saved).toHaveLength(2);
		expect(saved[0].sectionId).toMatch(/^[0-9a-f-]{36}$/);
		expect(saved[0].order).toBe(0);
		expect(saved[1].sectionId).toBe('11111111-1111-4111-8111-111111111111');
		expect(saved[1].order).toBe(1);
		expect(doc.markModified).toHaveBeenCalledWith('sections');
		expect(doc.save).toHaveBeenCalled();
	});

	it('records one page revision per save', async () => {
		const doc = fakeDoc();
		findOneMock.mockResolvedValue(doc);

		await replaceSections('page-1', { sections: [] }, 'u1');

		expect(revisionCreateMock).toHaveBeenCalledTimes(1);
		expect(revisionCreateMock.mock.calls[0][0]).toMatchObject({
			pageId: 'page-1',
			createdBy: 'u1',
		});
	});
});
