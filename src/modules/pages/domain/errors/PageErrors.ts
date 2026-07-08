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

export class PageInvalidParentError extends AppError {
	constructor() {
		super({
			statusCode: 422,
			code: 'PAGE_INVALID_PARENT',
			message: 'PAGE_INVALID_PARENT',
		});
	}
}

export class PageParentNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PAGE_PARENT_NOT_FOUND',
			message: 'PAGE_PARENT_NOT_FOUND',
		});
	}
}

export class PageHasChildrenError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'PAGE_HAS_CHILDREN',
			message: 'PAGE_HAS_CHILDREN',
		});
	}
}

export class PageRevisionNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PAGE_REVISION_NOT_FOUND',
			message: 'PAGE_REVISION_NOT_FOUND',
		});
	}
}
