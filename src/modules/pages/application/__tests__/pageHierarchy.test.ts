import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/pages/infrastructure/PageModel', () => ({
	default: { findOne: vi.fn(), find: vi.fn(), updateOne: vi.fn() },
}));

import {
	assertValidParent,
	computeFullPath,
	cascadeRecomputeFullPath,
} from '@Modules/pages/application/pageHierarchy';
import PageModel from '@Modules/pages/infrastructure/PageModel';
import {
	PageInvalidParentError,
	PageParentNotFoundError,
} from '@Modules/pages/domain/errors/PageErrors';

function mockLeanQuery(result: unknown) {
	return {
		select: vi.fn().mockReturnThis(),
		lean: vi.fn().mockResolvedValue(result),
	};
}

describe('assertValidParent', () => {
	it('does nothing when no parent is being set', async () => {
		await expect(
			assertValidParent('page-1', undefined),
		).resolves.toBeUndefined();
		await expect(assertValidParent('page-1', null)).resolves.toBeUndefined();
	});

	it('rejects a page becoming its own parent', async () => {
		await expect(assertValidParent('page-1', 'page-1')).rejects.toThrow(
			PageInvalidParentError,
		);
	});

	it('rejects when the candidate parent is actually a descendant (cycle)', async () => {
		// page-1 -> parentId page-3 (candidate); walking up from page-3: page-3's parent is page-1 itself
		vi.mocked(PageModel.findOne).mockReturnValueOnce(
			mockLeanQuery({ id: 'page-3', parentId: 'page-1' }) as never,
		);

		await expect(assertValidParent('page-1', 'page-3')).rejects.toThrow(
			PageInvalidParentError,
		);
	});

	it('accepts a valid, non-cyclic parent chain', async () => {
		vi.mocked(PageModel.findOne)
			.mockReturnValueOnce(
				mockLeanQuery({ id: 'page-3', parentId: 'page-4' }) as never,
			)
			.mockReturnValueOnce(
				mockLeanQuery({ id: 'page-4', parentId: null }) as never,
			);

		await expect(
			assertValidParent('page-1', 'page-3'),
		).resolves.toBeUndefined();
	});

	it('throws PageParentNotFoundError when the candidate parent does not exist', async () => {
		vi.mocked(PageModel.findOne).mockReturnValueOnce(
			mockLeanQuery(null) as never,
		);

		await expect(assertValidParent('page-1', 'ghost')).rejects.toThrow(
			PageParentNotFoundError,
		);
	});
});

describe('computeFullPath', () => {
	it('joins the parent path and own slug for a given language', () => {
		const result = computeFullPath(
			{ en: 'team', es: 'equipo' },
			{ en: 'about', es: 'nosotros' },
		);
		expect(result.en).toBe('about/team');
		expect(result.es).toBe('nosotros/equipo');
	});

	it('is empty for a language where the own slug is missing, even if the parent has one', () => {
		const result = computeFullPath({ en: '' }, { en: 'about' });
		expect(result.en).toBe('');
	});

	it('is just the own slug when there is no parent path', () => {
		const result = computeFullPath({ en: 'about' }, undefined);
		expect(result.en).toBe('about');
	});
});

describe('cascadeRecomputeFullPath', () => {
	it('recomputes fullPath for descendants using the parent chain', async () => {
		vi.mocked(PageModel.find)
			.mockReturnValueOnce(
				mockLeanQuery([
					{ id: 'child-1', slug: { en: 'team' }, parentId: 'root' },
				]) as never,
			)
			.mockReturnValueOnce(
				mockLeanQuery([{ id: 'root', fullPath: { en: 'about' } }]) as never,
			)
			.mockReturnValueOnce(mockLeanQuery([]) as never);

		await cascadeRecomputeFullPath('root');

		expect(PageModel.updateOne).toHaveBeenCalledWith(
			{ id: 'child-1' },
			{ $set: { fullPath: expect.objectContaining({ en: 'about/team' }) } },
		);
	});

	it('stops when there are no more descendants', async () => {
		vi.mocked(PageModel.find).mockReturnValueOnce(mockLeanQuery([]) as never);

		await cascadeRecomputeFullPath('leaf');

		expect(PageModel.updateOne).not.toHaveBeenCalled();
	});
});
