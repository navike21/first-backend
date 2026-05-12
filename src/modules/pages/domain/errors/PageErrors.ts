import { AppError } from '@Shared/domain/AppError';

export class PageNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PAGE_NOT_FOUND',
			message: 'PAGE_NOT_FOUND',
		});
	}
}

export class PageSlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'PAGE_SLUG_CONFLICT',
			message: 'PAGE_SLUG_CONFLICT',
		});
	}
}

export class PageSectionNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PAGE_SECTION_NOT_FOUND',
			message: 'PAGE_SECTION_NOT_FOUND',
		});
	}
}
