import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createProduct } from '@Modules/products/application/createProduct';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';
import StockModel from '@Modules/inventory/infrastructure/StockModel';
import { addCartItem } from '@Modules/cart/application/addCartItem';
import { clearCart } from '@Modules/cart/application/clearCart';

withMongo();

function emptyLocalized(value = '') {
	return {
		en: value,
		es: value,
		de: value,
		fr: value,
		it: value,
		ja: value,
		ko: value,
		pt: value,
		ru: value,
		zh: value,
	};
}

describe('clearCart', () => {
	it('empties an existing cart', async () => {
		const result = await createProduct({
			name: emptyLocalized('Widget'),
			slug: emptyLocalized(),
			shortDescription: emptyLocalized(),
			description: emptyLocalized(),
			sku: '',
			price: { amount: 1999, currency: 'USD' },
			categoryIds: [],
			tagIds: [],
			gallery: [],
			status: 'active',
			hasVariants: false,
			variantOptions: [],
			variants: [],
		});
		const product = result.data as { id: string };
		const location = await LocationModel.create({
			name: 'Almacén',
			type: 'warehouse',
		});
		await StockModel.create({
			productId: product.id,
			variantId: null,
			locationId: location.id,
			quantity: 5,
		});
		await addCartItem('customer-1', { productId: product.id, quantity: 2 });

		const cart = await clearCart('customer-1');

		expect(cart.items).toHaveLength(0);
	});

	it('is a no-op on a cart that was never used', async () => {
		const cart = await clearCart('customer-2');
		expect(cart.items).toHaveLength(0);
	});
});
