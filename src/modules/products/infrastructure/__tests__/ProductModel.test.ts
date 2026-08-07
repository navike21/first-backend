import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import ProductModel from '@Modules/products/infrastructure/ProductModel';

describe('ProductModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(ProductModel).toBeDefined();
		expect(typeof ProductModel.find).toBe('function');
		expect(typeof ProductModel.findOne).toBe('function');
		expect(typeof ProductModel.create).toBe('function');
	});
});
