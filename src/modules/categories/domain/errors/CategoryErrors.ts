import { AppError } from '@Shared/domain/AppError';

export class CategoryNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'CATEGORY_NOT_FOUND',
			message: 'CATEGORY_NOT_FOUND',
		});
	}
}

export class CategorySlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'CATEGORY_SLUG_CONFLICT',
			message: 'CATEGORY_SLUG_CONFLICT',
		});
	}
}

export class CategoryInvalidParentError extends AppError {
	constructor() {
		super({
			statusCode: 422,
			code: 'CATEGORY_INVALID_PARENT',
			message: 'CATEGORY_INVALID_PARENT',
		});
	}
}

export class CategoryParentNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'CATEGORY_PARENT_NOT_FOUND',
			message: 'CATEGORY_PARENT_NOT_FOUND',
		});
	}
}

export class CategoryHasChildrenError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'CATEGORY_HAS_CHILDREN',
			message: 'CATEGORY_HAS_CHILDREN',
		});
	}
}
