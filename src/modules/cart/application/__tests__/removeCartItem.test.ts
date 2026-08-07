import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createProduct } from '@Modules/products/application/createProduct';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';
import StockModel from '@Modules/inventory/infrastructure/StockModel';
import { addCartItem } from '@Modules/cart/application/addCartItem';
import { removeCartItem } from '@Modules/cart/application/removeCartItem';
import { CartItemNotFoundError } from '@Modules/cart/domain/errors/CartErrors';

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

describe('removeCartItem', () => {
	it('throws CartItemNotFoundError when the line does not exist', async () => {
		const product = await createActiveProductWithStock(5);
		await expect(
			removeCartItem('customer-1', product.id, {}),
		).rejects.toBeInstanceOf(CartItemNotFoundError);
	});

	it('removes an existing line', async () => {
		const product = await createActiveProductWithStock(5);
		await addCartItem('customer-1', { productId: product.id, quantity: 1 });

		const cart = await removeCartItem('customer-1', product.id, {});

		expect(cart.items).toHaveLength(0);
	});
});
