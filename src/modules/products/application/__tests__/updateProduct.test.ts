import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createProduct } from '@Modules/products/application/createProduct';
import { updateProduct } from '@Modules/products/application/updateProduct';
import {
	ProductNotFoundError,
	ProductSkuConflictError,
} from '@Modules/products/domain/errors/ProductErrors';

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

describe('updateProduct', () => {
	it('preserves an existing variant id sent back unchanged — critical for inventory.Stock references', async () => {
		const created = await createProduct({
			name: emptyLocalized('Shirt'),
			price: { amount: 1000, currency: 'USD' },
			hasVariants: true,
			variantOptions: [{ name: emptyLocalized('Size'), values: ['S', 'M'] }],
			variants: [
				{
					optionValues: { Size: 'S' },
					price: { amount: 1000, currency: 'USD' },
				},
			],
		});
		const originalVariant = (
			created.data.variants as {
				id: string;
				optionValues: Record<string, string>;
			}[]
		)[0];

		const updated = await updateProduct(created.data.id as string, {
			hasVariants: true,
			variants: [
				{
					id: originalVariant.id,
					optionValues: { Size: 'S' },
					price: { amount: 1200, currency: 'USD' },
				},
			],
		});

		const updatedVariant = (
			updated.data.variants as { id: string; price: { amount: number } }[]
		)[0];
		expect(updatedVariant.id).toBe(originalVariant.id);
		expect(updatedVariant.price.amount).toBe(1200);
	});

	it('assigns a fresh id to a genuinely new variant added on update', async () => {
		const created = await createProduct({
			name: emptyLocalized('Mug'),
			price: { amount: 500, currency: 'USD' },
			hasVariants: true,
			variantOptions: [{ name: emptyLocalized('Color'), values: ['Red'] }],
			variants: [
				{
					optionValues: { Color: 'Red' },
					price: { amount: 500, currency: 'USD' },
				},
			],
		});
		const originalVariant = (created.data.variants as { id: string }[])[0];

		const updated = await updateProduct(created.data.id as string, {
			hasVariants: true,
			variants: [
				{
					id: originalVariant.id,
					optionValues: { Color: 'Red' },
					price: { amount: 500, currency: 'USD' },
				},
				{
					optionValues: { Color: 'Blue' },
					price: { amount: 500, currency: 'USD' },
				},
			],
		});

		const variants = updated.data.variants as { id: string }[];
		expect(variants).toHaveLength(2);
		expect(variants[0].id).toBe(originalVariant.id);
		expect(variants[1].id).toBeTruthy();
		expect(variants[1].id).not.toBe(originalVariant.id);
	});

	it('does not preserve an id the client invented that never existed on the document', async () => {
		const created = await createProduct({
			name: emptyLocalized('Hat'),
			price: { amount: 800, currency: 'USD' },
		});

		const updated = await updateProduct(created.data.id as string, {
			hasVariants: true,
			variants: [
				{
					id: '00000000-0000-0000-0000-000000000000',
					optionValues: { Size: 'One' },
					price: { amount: 800, currency: 'USD' },
				},
			],
		});

		const variants = updated.data.variants as { id: string }[];
		expect(variants[0].id).not.toBe('00000000-0000-0000-0000-000000000000');
	});

	it('throws ProductNotFoundError for a missing product', async () => {
		await expect(
			updateProduct('00000000-0000-0000-0000-000000000000', {
				price: { amount: 100, currency: 'USD' },
			}),
		).rejects.toBeInstanceOf(ProductNotFoundError);
	});

	it('throws ProductSkuConflictError when updating to a SKU another product already has', async () => {
		await createProduct({
			name: emptyLocalized('A'),
			sku: 'TAKEN',
			price: { amount: 100, currency: 'USD' },
		});
		const other = await createProduct({
			name: emptyLocalized('B'),
			price: { amount: 100, currency: 'USD' },
		});

		await expect(
			updateProduct(other.data.id as string, { sku: 'TAKEN' }),
		).rejects.toBeInstanceOf(ProductSkuConflictError);
	});

	it('leaves the gallery untouched when galleryOrder is omitted', async () => {
		const created = await createProduct({
			name: emptyLocalized('Lamp'),
			price: { amount: 100, currency: 'USD' },
			gallery: ['https://example.com/lamp.jpg'],
		});

		const updated = await updateProduct(created.data.id as string, {
			price: { amount: 150, currency: 'USD' },
		});

		expect(updated.data.gallery).toEqual(['https://example.com/lamp.jpg']);
	});
});
