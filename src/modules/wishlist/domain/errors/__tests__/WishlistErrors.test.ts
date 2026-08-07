import { describe, it, expect } from 'vitest';
import {
	WishlistProductNotFoundError,
	WishlistItemNotFoundError,
} from '@Modules/wishlist/domain/errors/WishlistErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Wishlist domain errors', () => {
	it('WishlistProductNotFoundError has correct code and status', () => {
		const error = new WishlistProductNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('WISHLIST_PRODUCT_NOT_FOUND');
	});

	it('WishlistItemNotFoundError has correct code and status', () => {
		const error = new WishlistItemNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('WISHLIST_ITEM_NOT_FOUND');
	});
});
