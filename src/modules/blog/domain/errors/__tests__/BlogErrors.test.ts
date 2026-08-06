import { describe, it, expect } from 'vitest';
import {
	BlogNotFoundError,
	BlogSlugConflictError,
} from '@Modules/blog/domain/errors/BlogErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Blog domain errors', () => {
	it('BlogNotFoundError has correct code and status', () => {
		const error = new BlogNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('BLOG_NOT_FOUND');
	});

	it('BlogSlugConflictError has correct code and status', () => {
		const error = new BlogSlugConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('BLOG_SLUG_CONFLICT');
	});
});
