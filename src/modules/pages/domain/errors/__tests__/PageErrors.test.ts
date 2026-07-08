import { describe, it, expect } from 'vitest';
import {
	PageNotFoundError,
	PageSlugConflictError,
	PageSectionNotFoundError,
	PageInvalidParentError,
	PageParentNotFoundError,
	PageHasChildrenError,
	PageRevisionNotFoundError,
} from '@Modules/pages/domain/errors/PageErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Page domain errors', () => {
	it('PageNotFoundError has correct code and status', () => {
		const error = new PageNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PAGE_NOT_FOUND');
	});

	it('PageSlugConflictError has correct code and status', () => {
		const error = new PageSlugConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('PAGE_SLUG_CONFLICT');
	});

	it('PageSectionNotFoundError has correct code and status', () => {
		const error = new PageSectionNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PAGE_SECTION_NOT_FOUND');
	});

	it('PageInvalidParentError has correct code and status', () => {
		const error = new PageInvalidParentError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(422);
		expect(error.code).toBe('PAGE_INVALID_PARENT');
	});

	it('PageParentNotFoundError has correct code and status', () => {
		const error = new PageParentNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PAGE_PARENT_NOT_FOUND');
	});

	it('PageHasChildrenError has correct code and status', () => {
		const error = new PageHasChildrenError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('PAGE_HAS_CHILDREN');
	});

	it('PageRevisionNotFoundError has correct code and status', () => {
		const error = new PageRevisionNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PAGE_REVISION_NOT_FOUND');
	});
});
