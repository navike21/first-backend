import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import ProductCategoryModel from '@Modules/product-categories/infrastructure/ProductCategoryModel';

describe('ProductCategoryModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(ProductCategoryModel).toBeDefined();
		expect(typeof ProductCategoryModel.find).toBe('function');
		expect(typeof ProductCategoryModel.findOne).toBe('function');
		expect(typeof ProductCategoryModel.create).toBe('function');
	});
});
