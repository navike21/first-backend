import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));

import CartModel from '@Modules/cart/infrastructure/CartModel';

describe('CartModel', () => {
	it('is defined and has mongoose methods', () => {
		expect(CartModel).toBeDefined();
		expect(typeof CartModel.find).toBe('function');
		expect(typeof CartModel.findOne).toBe('function');
		expect(typeof CartModel.create).toBe('function');
	});
});
