import { AppError } from '@Shared/domain/AppError';

export class BlogNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'BLOG_NOT_FOUND',
			message: 'Blog post not found',
		});
	}
}

export class BlogSlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'BLOG_SLUG_CONFLICT',
			message: 'A blog post with this slug already exists',
		});
	}
}
