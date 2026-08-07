import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createProduct } from '@Modules/products/application/createProduct';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';
import StockModel from '@Modules/inventory/infrastructure/StockModel';
import { addCartItem } from '@Modules/cart/application/addCartItem';
import { updateCartItemQuantity } from '@Modules/cart/application/updateCartItemQuantity';
import {
	CartItemNotFoundError,
	CartOutOfStockError,
} from '@Modules/cart/domain/errors/CartErrors';

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

async function createActiveProductWithStock(quantity: number) {
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
		quantity,
	});
	return product;
}

describe('updateCartItemQuantity', () => {
	it('throws CartItemNotFoundError when the line does not exist', async () => {
		const product = await createActiveProductWithStock(5);
		await expect(
			updateCartItemQuantity('customer-1', product.id, { quantity: 2 }),
		).rejects.toBeInstanceOf(CartItemNotFoundError);
	});

	it('sets the absolute quantity for an existing line', async () => {
		const product = await createActiveProductWithStock(5);
		await addCartItem('customer-1', { productId: product.id, quantity: 1 });

		const cart = await updateCartItemQuantity('customer-1', product.id, {
			quantity: 4,
		});

		expect(cart.items[0].quantity).toBe(4);
	});

	it('rejects a quantity that exceeds available stock', async () => {
		const product = await createActiveProductWithStock(3);
		await addCartItem('customer-1', { productId: product.id, quantity: 1 });

		await expect(
			updateCartItemQuantity('customer-1', product.id, { quantity: 10 }),
		).rejects.toBeInstanceOf(CartOutOfStockError);
	});
});
