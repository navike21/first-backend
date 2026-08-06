import { describe, it, expect } from 'vitest';
import {
	ProductCategoryNotFoundError,
	ProductCategorySlugConflictError,
	ProductCategoryInvalidParentError,
	ProductCategoryParentNotFoundError,
	ProductCategoryHasChildrenError,
} from '@Modules/product-categories/domain/errors/ProductCategoryErrors';
import { AppError } from '@Shared/domain/AppError';

describe('ProductCategory domain errors', () => {
	it('ProductCategoryNotFoundError has correct code and status', () => {
		const error = new ProductCategoryNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PRODUCT_CATEGORY_NOT_FOUND');
	});

	it('ProductCategorySlugConflictError has correct code and status', () => {
		const error = new ProductCategorySlugConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('PRODUCT_CATEGORY_SLUG_CONFLICT');
	});

	it('ProductCategoryInvalidParentError has correct code and status', () => {
		const error = new ProductCategoryInvalidParentError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(422);
		expect(error.code).toBe('PRODUCT_CATEGORY_INVALID_PARENT');
	});

	it('ProductCategoryParentNotFoundError has correct code and status', () => {
		const error = new ProductCategoryParentNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('PRODUCT_CATEGORY_PARENT_NOT_FOUND');
	});

	it('ProductCategoryHasChildrenError has correct code and status', () => {
		const error = new ProductCategoryHasChildrenError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('PRODUCT_CATEGORY_HAS_CHILDREN');
	});
});
