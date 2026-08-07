import { AppError } from '@Shared/domain/AppError';

export class WishlistProductNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'WISHLIST_PRODUCT_NOT_FOUND',
			message: 'Product not found or not available',
		});
	}
}

export class WishlistItemNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'WISHLIST_ITEM_NOT_FOUND',
			message: 'This product is not in the wishlist',
		});
	}
}
