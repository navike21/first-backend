import { describe, it, expect } from 'vitest';
import {
	CartProductNotFoundError,
	CartVariantNotFoundError,
	CartVariantRequiredError,
	CartOutOfStockError,
	CartItemNotFoundError,
} from '@Modules/cart/domain/errors/CartErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Cart domain errors', () => {
	it('CartProductNotFoundError has correct code and status', () => {
		const error = new CartProductNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('CART_PRODUCT_NOT_FOUND');
	});

	it('CartVariantNotFoundError has correct code and status', () => {
		const error = new CartVariantNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('CART_VARIANT_NOT_FOUND');
	});

	it('CartVariantRequiredError has correct code and status', () => {
		const error = new CartVariantRequiredError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(422);
		expect(error.code).toBe('CART_VARIANT_REQUIRED');
	});

	it('CartOutOfStockError has correct code and status', () => {
		const error = new CartOutOfStockError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('CART_OUT_OF_STOCK');
	});

	it('CartItemNotFoundError has correct code and status', () => {
		const error = new CartItemNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('CART_ITEM_NOT_FOUND');
	});
});
