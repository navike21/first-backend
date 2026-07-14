import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn() },
}));

import { resolvePageByPath } from '@Modules/pages/application/resolvePageByPath';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import { PageNotFoundError } from '@Modules/pages/domain/errors/PageErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('resolvePageByPath', () => {
	it('returns page data when found (public)', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue(
			mockQueryBuilder({
				id: '1',
				fullPath: { en: 'home' },
				_id: 'mongo1',
			}) as never,
		);

		const result = await resolvePageByPath('home', 'en');

		expect(result).not.toHaveProperty('_id');
		expect(result.fullPath.en).toBe('home');
	});

	it('resolves by fullPath for the given language and only publicly visible pages', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue(
			mockQueryBuilder({ id: '1', fullPath: { en: 'home' } }) as never,
		);

		await resolvePageByPath('home', 'en');

		expect(PageModel.findOne).toHaveBeenCalledWith(
			expect.objectContaining({ 'fullPath.en': 'home', deletedAt: null }),
		);
	});

	it('throws PageNotFoundError when not found', async () => {
		vi.mocked(PageModel.findOne).mockReturnValue(
			mockQueryBuilder(null) as never,
		);

		await expect(resolvePageByPath('not-found', 'en')).rejects.toThrow(
			PageNotFoundError,
		);
	});
});
