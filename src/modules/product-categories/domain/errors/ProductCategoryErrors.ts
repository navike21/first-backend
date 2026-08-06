import { AppError } from '@Shared/domain/AppError';

export class ProductCategoryNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PRODUCT_CATEGORY_NOT_FOUND',
			message: 'PRODUCT_CATEGORY_NOT_FOUND',
		});
	}
}

export class ProductCategorySlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'PRODUCT_CATEGORY_SLUG_CONFLICT',
			message: 'PRODUCT_CATEGORY_SLUG_CONFLICT',
		});
	}
}

export class ProductCategoryInvalidParentError extends AppError {
	constructor() {
		super({
			statusCode: 422,
			code: 'PRODUCT_CATEGORY_INVALID_PARENT',
			message: 'PRODUCT_CATEGORY_INVALID_PARENT',
		});
	}
}

export class ProductCategoryParentNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PRODUCT_CATEGORY_PARENT_NOT_FOUND',
			message: 'PRODUCT_CATEGORY_PARENT_NOT_FOUND',
		});
	}
}

export class ProductCategoryHasChildrenError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'PRODUCT_CATEGORY_HAS_CHILDREN',
			message: 'PRODUCT_CATEGORY_HAS_CHILDREN',
		});
	}
}
