import { describe, it, expect } from 'vitest';
import {
	AddCartItemSchema,
	UpdateCartItemQuantitySchema,
	RemoveCartItemSchema,
} from '@Modules/cart/schemas/cart.schema';

const productId = '11111111-1111-4111-8111-111111111111';
const variantId = '22222222-2222-4222-8222-222222222222';

describe('AddCartItemSchema', () => {
	it('accepts a simple product without a variant', () => {
		const result = AddCartItemSchema.safeParse({ productId, quantity: 2 });
		expect(result.success).toBe(true);
	});

	it('accepts a variant product', () => {
		const result = AddCartItemSchema.safeParse({
			productId,
			variantId,
			quantity: 1,
		});
		expect(result.success).toBe(true);
	});

	it('rejects an invalid productId', () => {
		const result = AddCartItemSchema.safeParse({
			productId: 'not-a-uuid',
			quantity: 1,
		});
		expect(result.success).toBe(false);
	});

	it('rejects a quantity below 1', () => {
		const result = AddCartItemSchema.safeParse({ productId, quantity: 0 });
		expect(result.success).toBe(false);
	});

	it('rejects a quantity above the 999 cap', () => {
		const result = AddCartItemSchema.safeParse({ productId, quantity: 1000 });
		expect(result.success).toBe(false);
	});
});

describe('UpdateCartItemQuantitySchema', () => {
	it('accepts a valid quantity', () => {
		const result = UpdateCartItemQuantitySchema.safeParse({ quantity: 5 });
		expect(result.success).toBe(true);
	});

	it('rejects a missing quantity', () => {
		const result = UpdateCartItemQuantitySchema.safeParse({});
		expect(result.success).toBe(false);
	});
});

describe('RemoveCartItemSchema', () => {
	it('accepts an empty body (simple product line)', () => {
		const result = RemoveCartItemSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('accepts a variantId', () => {
		const result = RemoveCartItemSchema.safeParse({ variantId });
		expect(result.success).toBe(true);
	});
});
