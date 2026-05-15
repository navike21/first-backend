import { describe, it, expect } from 'vitest';
import {
	PageNotFoundError,
	PageSlugConflictError,
	PageSectionNotFoundError,
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
});
