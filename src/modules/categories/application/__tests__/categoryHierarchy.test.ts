import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/categories/infrastructure/CategoryModel', () => ({
	default: { findOne: vi.fn() },
}));

import { assertValidParent } from '@Modules/categories/application/categoryHierarchy';
import CategoryModel from '@Modules/categories/infrastructure/CategoryModel';
import {
	CategoryInvalidParentError,
	CategoryParentNotFoundError,
} from '@Modules/categories/domain/errors/CategoryErrors';

function mockLeanFindOne(result: unknown) {
	return {
		select: vi.fn().mockReturnThis(),
		lean: vi.fn().mockResolvedValue(result),
	};
}

describe('assertValidParent', () => {
	it('does nothing when no parent is being set', async () => {
		await expect(
			assertValidParent('cat-1', undefined),
		).resolves.toBeUndefined();
		await expect(assertValidParent('cat-1', null)).resolves.toBeUndefined();
	});

	it('rejects a category becoming its own parent', async () => {
		await expect(assertValidParent('cat-1', 'cat-1')).rejects.toThrow(
			CategoryInvalidParentError,
		);
	});

	it('rejects when the candidate parent is actually a descendant (cycle)', async () => {
		vi.mocked(CategoryModel.findOne).mockReturnValueOnce(
			mockLeanFindOne({ id: 'cat-3', parentId: 'cat-1' }) as never,
		);

		await expect(assertValidParent('cat-1', 'cat-3')).rejects.toThrow(
			CategoryInvalidParentError,
		);
	});

	it('accepts a valid, non-cyclic parent chain', async () => {
		vi.mocked(CategoryModel.findOne)
			.mockReturnValueOnce(
				mockLeanFindOne({ id: 'cat-3', parentId: 'cat-4' }) as never,
			)
			.mockReturnValueOnce(
				mockLeanFindOne({ id: 'cat-4', parentId: null }) as never,
			);

		await expect(assertValidParent('cat-1', 'cat-3')).resolves.toBeUndefined();
	});

	it('throws CategoryParentNotFoundError when the candidate parent does not exist', async () => {
		vi.mocked(CategoryModel.findOne).mockReturnValueOnce(
			mockLeanFindOne(null) as never,
		);

		await expect(assertValidParent('cat-1', 'ghost')).rejects.toThrow(
			CategoryParentNotFoundError,
		);
	});
});
