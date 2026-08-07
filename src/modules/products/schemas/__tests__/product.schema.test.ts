import { describe, it, expect } from 'vitest';
import {
	CreateProductSchema,
	UpdateProductSchema,
	ListProductsQuerySchema,
	ListProductsAdminQuerySchema,
} from '@Modules/products/schemas/product.schema';

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
	price: { amount: 1999, currency: 'usd' },
};

describe('CreateProductSchema', () => {
	it('accepts a minimal simple product and defaults hasVariants/status', () => {
		const result = CreateProductSchema.parse(basePayload);
		expect(result.hasVariants).toBe(false);
		expect(result.status).toBe('draft');
		expect(result.price.currency).toBe('USD');
	});

	it('rejects hasVariants=true with an empty variants array', () => {
		const result = CreateProductSchema.safeParse({
			...basePayload,
			hasVariants: true,
			variants: [],
		});
		expect(result.success).toBe(false);
	});

	it('accepts hasVariants=true with at least one variant', () => {
		const result = CreateProductSchema.parse({
			...basePayload,
			hasVariants: true,
			variantOptions: [{ name: emptyLocalized('Talla'), values: ['S', 'M'] }],
			variants: [
				{
					optionValues: { Talla: 'S' },
					price: { amount: 1999, currency: 'USD' },
				},
			],
		});
		expect(result.variants).toHaveLength(1);
		expect(result.variants[0].id).toBeUndefined();
	});

	it('rejects a negative price amount', () => {
		const result = CreateProductSchema.safeParse({
			...basePayload,
			price: { amount: -100, currency: 'USD' },
		});
		expect(result.success).toBe(false);
	});

	it('rejects a currency that is not 3 letters', () => {
		const result = CreateProductSchema.safeParse({
			...basePayload,
			price: { amount: 1000, currency: 'US' },
		});
		expect(result.success).toBe(false);
	});

	it('rejects a gallery URL that is not a valid URL', () => {
		const result = CreateProductSchema.safeParse({
			...basePayload,
			gallery: ['not-a-url'],
		});
		expect(result.success).toBe(false);
	});

	it('caps the gallery at PRODUCT_GALLERY_MAX_ITEMS', () => {
		const urls = Array.from(
			{ length: 11 },
			(_, i) => `https://example.com/${i}.jpg`,
		);
		const result = CreateProductSchema.safeParse({
			...basePayload,
			gallery: urls,
		});
		expect(result.success).toBe(false);
	});
});

describe('UpdateProductSchema', () => {
	it('accepts a partial update with just the price', () => {
		const result = UpdateProductSchema.parse({
			price: { amount: 500, currency: 'USD' },
		});
		expect(result.price?.amount).toBe(500);
	});

	it('preserves an existing variant id when sent back', () => {
		const result = UpdateProductSchema.parse({
			variants: [
				{
					id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
					optionValues: { Talla: 'M' },
					price: { amount: 2000, currency: 'USD' },
				},
			],
		});
		expect(result.variants?.[0].id).toBe(
			'3fa85f64-5717-4562-b3fc-2c963f66afa6',
		);
	});

	it('accepts a galleryOrder reconciliation payload', () => {
		const result = UpdateProductSchema.parse({
			galleryOrder: [
				{ type: 'existing', url: 'https://example.com/a.jpg' },
				{ type: 'new', index: 0 },
			],
		});
		expect(result.galleryOrder).toHaveLength(2);
	});

	it('rejects hasVariants=true with no variants on a partial update', () => {
		const result = UpdateProductSchema.safeParse({ hasVariants: true });
		expect(result.success).toBe(false);
	});
});

describe('ListProductsQuerySchema', () => {
	it('defaults page/limit', () => {
		const result = ListProductsQuerySchema.parse({});
		expect(result.page).toBe(1);
		expect(result.limit).toBe(10);
	});
});

describe('ListProductsAdminQuerySchema', () => {
	it('accepts an optional status filter', () => {
		const result = ListProductsAdminQuerySchema.parse({ status: 'active' });
		expect(result.status).toBe('active');
	});

	it('rejects an invalid status', () => {
		const result = ListProductsAdminQuerySchema.safeParse({
			status: 'nonsense',
		});
		expect(result.success).toBe(false);
	});
});
