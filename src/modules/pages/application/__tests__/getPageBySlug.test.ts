import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getPageBySlug } from '@Modules/pages/application/getPageBySlug';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import { PageNotFoundError } from '@Modules/pages/domain/errors/PageErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('getPageBySlug', () => {
	it('returns page data when found (public)', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue(
			mockQueryBuilder({
				id: '1',
				slug: 'home',
				_id: 'mongo1',
			}) as never,
		);

		const result = await getPageBySlug('home');

		expect(result).not.toHaveProperty('_id');
		expect(result.slug).toBe('home');
	});

	it('uses published filter for public view', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue(
			mockQueryBuilder({ id: '1', slug: 'home' }) as never,
		);

		await getPageBySlug('home', false);

		expect(PageModel.findOne).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'published', isPublished: true }),
		);
	});

	it('uses ne deleted filter for adminView', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue(
			mockQueryBuilder({ id: '1', slug: 'home' }) as never,
		);

		await getPageBySlug('home', true);

		expect(PageModel.findOne).toHaveBeenCalledWith(
			expect.objectContaining({ status: { $ne: 'deleted' } }),
		);
	});

	it('throws PageNotFoundError when not found', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue(
			mockQueryBuilder(null) as never,
		);

		await expect(getPageBySlug('not-found')).rejects.toThrow(PageNotFoundError);
	});
});
