import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { getOrCreateCart } from '@Modules/cart/application/getOrCreateCart';
import CartModel from '@Modules/cart/infrastructure/CartModel';

withMongo();

describe('getOrCreateCart', () => {
	it('creates an empty cart on first access', async () => {
		const cart = await getOrCreateCart('customer-1');

		expect(cart.customerId).toBe('customer-1');
		expect(cart.items).toHaveLength(0);
	});

	it('returns the same cart on subsequent access', async () => {
		const first = await getOrCreateCart('customer-2');
		await CartModel.updateOne(
			{ id: first.id },
			{ $push: { items: { productId: 'p1', variantId: null, quantity: 1 } } },
		);

		const second = await getOrCreateCart('customer-2');

		expect(second.id).toBe(first.id);
		expect(second.items).toHaveLength(1);
	});

	it('never creates two carts for the same customer under a race', async () => {
		const [a, b] = await Promise.all([
			getOrCreateCart('customer-3'),
			getOrCreateCart('customer-3'),
		]);

		expect(a.id).toBe(b.id);
		const count = await CartModel.countDocuments({ customerId: 'customer-3' });
		expect(count).toBe(1);
	});
});
