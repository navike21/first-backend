import { describe, it, expect } from 'vitest';
import {
	TagNotFoundError,
	TagSlugConflictError,
} from '@Modules/tags/domain/errors/TagErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Tag domain errors', () => {
	it('TagNotFoundError has correct code and status', () => {
		const error = new TagNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('TAG_NOT_FOUND');
	});

	it('TagSlugConflictError has correct code and status', () => {
		const error = new TagSlugConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('TAG_SLUG_CONFLICT');
	});
});
