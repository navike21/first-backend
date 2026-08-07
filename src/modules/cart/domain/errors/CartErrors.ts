import { AppError } from '@Shared/domain/AppError';

export class CartProductNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'CART_PRODUCT_NOT_FOUND',
			message: 'Product not found or not available',
		});
	}
}

export class CartVariantNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'CART_VARIANT_NOT_FOUND',
			message: 'This product variant does not exist',
		});
	}
}

export class CartVariantRequiredError extends AppError {
	constructor() {
		super({
			statusCode: 422,
			code: 'CART_VARIANT_REQUIRED',
			message: 'This product requires a variant to be selected',
		});
	}
}

export class CartOutOfStockError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'CART_OUT_OF_STOCK',
			message: 'Not enough stock available for the requested quantity',
		});
	}
}

export class CartItemNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'CART_ITEM_NOT_FOUND',
			message: 'This item is not in the cart',
		});
	}
}
