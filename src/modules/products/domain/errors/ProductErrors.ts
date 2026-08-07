import { AppError } from '@Shared/domain/AppError';

export class ProductNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'PRODUCT_NOT_FOUND',
			message: 'Product not found',
		});
	}
}

export class ProductSlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'PRODUCT_SLUG_CONFLICT',
			message: 'A product with this slug already exists',
		});
	}
}

export class ProductSkuConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'PRODUCT_SKU_CONFLICT',
			message: 'A product with this SKU already exists',
		});
	}
}
