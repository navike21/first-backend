import { describe, it, expect } from 'vitest';
import {
	ProductNotFoundError,
	ProductSlugConflictError,
	ProductSkuConflictError,
} from '@Modules/products/domain/errors/ProductErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Product domain errors', () => {
	it('ProductNotFoundError has correct code and status', () => {
		const error = new ProductNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PRODUCT_NOT_FOUND');
	});

	it('ProductSlugConflictError has correct code and status', () => {
		const error = new ProductSlugConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('PRODUCT_SLUG_CONFLICT');
	});

	it('ProductSkuConflictError has correct code and status', () => {
		const error = new ProductSkuConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('PRODUCT_SKU_CONFLICT');
	});
});
