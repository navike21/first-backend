import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createProduct } from '@Modules/products/application/createProduct';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';
import StockModel from '@Modules/inventory/infrastructure/StockModel';
import { addCartItem } from '@Modules/cart/application/addCartItem';
import {
	CartProductNotFoundError,
	CartVariantNotFoundError,
	CartVariantRequiredError,
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

async function createActiveProduct(overrides: Record<string, unknown> = {}) {
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
		...overrides,
	});
	return result.data as { id: string; variants: { id: string }[] };
}

async function seedStock(productId: string, quantity: number, variantId?: string) {
	const location = await LocationModel.create({
		name: 'Almacén',
		type: 'warehouse',
	});
	await StockModel.create({
		productId,
		variantId: variantId ?? null,
		locationId: location.id,
		quantity,
	});
}

describe('addCartItem', () => {
	it('throws CartProductNotFoundError for a nonexistent product', async () => {
		await expect(
			addCartItem('customer-1', { productId: crypto.randomUUID(), quantity: 1 }),
		).rejects.toBeInstanceOf(CartProductNotFoundError);
	});

	it('throws CartProductNotFoundError for a draft (non-active) product', async () => {
		const product = await createActiveProduct({ status: 'draft' });
		await expect(
			addCartItem('customer-1', { productId: product.id, quantity: 1 }),
		).rejects.toBeInstanceOf(CartProductNotFoundError);
	});

	it('throws CartOutOfStockError when no stock is configured', async () => {
		const product = await createActiveProduct();
		await expect(
			addCartItem('customer-1', { productId: product.id, quantity: 1 }),
		).rejects.toBeInstanceOf(CartOutOfStockError);
	});

	it('adds a simple product within stock', async () => {
		const product = await createActiveProduct();
		await seedStock(product.id, 5);

		const cart = await addCartItem('customer-1', {
			productId: product.id,
			quantity: 2,
		});

		expect(cart.items).toHaveLength(1);
		expect(cart.items[0].quantity).toBe(2);
		expect(cart.items[0].variantId).toBeNull();
	});

	it('increments quantity when the same line is added again', async () => {
		const product = await createActiveProduct();
		await seedStock(product.id, 5);

		await addCartItem('customer-1', { productId: product.id, quantity: 2 });
		const cart = await addCartItem('customer-1', {
			productId: product.id,
			quantity: 1,
		});

		expect(cart.items).toHaveLength(1);
		expect(cart.items[0].quantity).toBe(3);
	});

	it('rejects a quantity that exceeds available stock', async () => {
		const product = await createActiveProduct();
		await seedStock(product.id, 2);

		await expect(
			addCartItem('customer-1', { productId: product.id, quantity: 3 }),
		).rejects.toBeInstanceOf(CartOutOfStockError);
	});

	it('requires a variantId for a product that has variants', async () => {
		const product = await createActiveProduct({
			hasVariants: true,
			variantOptions: [{ name: emptyLocalized('Talla'), values: ['S', 'M'] }],
			variants: [
				{
					optionValues: { Talla: 'S' },
					price: { amount: 1999, currency: 'USD' },
				},
				{
					optionValues: { Talla: 'M' },
					price: { amount: 1999, currency: 'USD' },
				},
			],
		});

		await expect(
			addCartItem('customer-1', { productId: product.id, quantity: 1 }),
		).rejects.toBeInstanceOf(CartVariantRequiredError);
	});

	it('throws CartVariantNotFoundError for a variantId that does not exist on the product', async () => {
		const product = await createActiveProduct({
			hasVariants: true,
			variantOptions: [{ name: emptyLocalized('Talla'), values: ['S'] }],
			variants: [
				{
					optionValues: { Talla: 'S' },
					price: { amount: 1999, currency: 'USD' },
				},
			],
		});

		await expect(
			addCartItem('customer-1', {
				productId: product.id,
				variantId: crypto.randomUUID(),
				quantity: 1,
			}),
		).rejects.toBeInstanceOf(CartVariantNotFoundError);
	});

	it('adds a variant line, checking stock scoped to that variant only', async () => {
		const product = await createActiveProduct({
			hasVariants: true,
			variantOptions: [{ name: emptyLocalized('Talla'), values: ['S', 'M'] }],
			variants: [
				{
					optionValues: { Talla: 'S' },
					price: { amount: 1999, currency: 'USD' },
				},
				{
					optionValues: { Talla: 'M' },
					price: { amount: 1999, currency: 'USD' },
				},
			],
		});
		const [sVariant] = product.variants;
		// No stock at all for M — adding S must not be blocked by M's absence.
		await seedStock(product.id, 3, sVariant.id);

		const cart = await addCartItem('customer-1', {
			productId: product.id,
			variantId: sVariant.id,
			quantity: 2,
		});

		expect(cart.items).toHaveLength(1);
		expect(cart.items[0].variantId).toBe(sVariant.id);
	});
});
