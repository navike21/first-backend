import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createProduct } from '@Modules/products/application/createProduct';
import ProductModel from '@Modules/products/infrastructure/ProductModel';
import {
	ProductSlugConflictError,
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

const basePayload = {
	name: emptyLocalized('Widget'),
	slug: emptyLocalized(),
	shortDescription: emptyLocalized(),
	description: emptyLocalized(),
	sku: '',
	price: { amount: 1999, currency: 'USD' },
	categoryIds: [],
	tagIds: [],
	gallery: [],
	status: 'draft' as const,
	hasVariants: false,
	variantOptions: [],
	variants: [],
};

describe('createProduct', () => {
	it('creates a product and slugifies the name per language', async () => {
		const result = await createProduct(basePayload);
		expect(result.data.name).toMatchObject({ en: 'Widget' });
		expect((result.data.slug as Record<string, string>).en).toBe('widget');
	});

	it('assigns a fresh id to every variant on create', async () => {
		const result = await createProduct({
			...basePayload,
			name: emptyLocalized('Shirt'),
			hasVariants: true,
			variantOptions: [{ name: emptyLocalized('Size'), values: ['S', 'M'] }],
			variants: [
				{
					optionValues: { Size: 'S' },
					price: { amount: 1000, currency: 'USD' },
				},
				{
					optionValues: { Size: 'M' },
					price: { amount: 1000, currency: 'USD' },
				},
			],
		});
		const variants = result.data.variants as { id: string }[];
		expect(variants).toHaveLength(2);
		expect(variants[0].id).toBeTruthy();
		expect(variants[1].id).toBeTruthy();
		expect(variants[0].id).not.toBe(variants[1].id);
	});

	it('throws ProductSlugConflictError when a slug already exists', async () => {
		await createProduct({ ...basePayload, name: emptyLocalized('First') });
		await expect(
			createProduct({
				...basePayload,
				name: emptyLocalized('Second'),
				slug: emptyLocalized('first'),
			}),
		).rejects.toBeInstanceOf(ProductSlugConflictError);
	});

	it('throws ProductSkuConflictError when the SKU already exists', async () => {
		await createProduct({
			...basePayload,
			name: emptyLocalized('SkuOne'),
			sku: 'ABC-123',
		});
		await expect(
			createProduct({
				...basePayload,
				name: emptyLocalized('SkuTwo'),
				sku: 'ABC-123',
			}),
		).rejects.toBeInstanceOf(ProductSkuConflictError);
	});

	it('allows two products with an empty SKU (partial unique index)', async () => {
		await createProduct({ ...basePayload, name: emptyLocalized('NoSkuOne') });
		await expect(
			createProduct({ ...basePayload, name: emptyLocalized('NoSkuTwo') }),
		).resolves.toBeTruthy();
		const count = await ProductModel.countDocuments({});
		expect(count).toBe(2);
	});
});
