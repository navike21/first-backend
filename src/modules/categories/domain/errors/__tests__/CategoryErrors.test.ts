import { describe, it, expect } from 'vitest';
import {
	CategoryNotFoundError,
	CategorySlugConflictError,
	CategoryInvalidParentError,
	CategoryParentNotFoundError,
	CategoryHasChildrenError,
} from '@Modules/categories/domain/errors/CategoryErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Category domain errors', () => {
	it('CategoryNotFoundError has correct code and status', () => {
		const error = new CategoryNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('CATEGORY_NOT_FOUND');
	});

	it('CategorySlugConflictError has correct code and status', () => {
		const error = new CategorySlugConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('CATEGORY_SLUG_CONFLICT');
	});

	it('CategoryInvalidParentError has correct code and status', () => {
		const error = new CategoryInvalidParentError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(422);
		expect(error.code).toBe('CATEGORY_INVALID_PARENT');
	});

	it('CategoryParentNotFoundError has correct code and status', () => {
		const error = new CategoryParentNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('CATEGORY_PARENT_NOT_FOUND');
	});

	it('CategoryHasChildrenError has correct code and status', () => {
		const error = new CategoryHasChildrenError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('CATEGORY_HAS_CHILDREN');
	});
});
