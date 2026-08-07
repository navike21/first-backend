import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createProduct } from '@Modules/products/application/createProduct';
import { addWishlistItem } from '@Modules/wishlist/application/addWishlistItem';
import { WishlistProductNotFoundError } from '@Modules/wishlist/domain/errors/WishlistErrors';

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

async function createActiveProduct() {
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
	return result.data as { id: string };
}

describe('addWishlistItem', () => {
	it('throws WishlistProductNotFoundError for a nonexistent product', async () => {
		await expect(
			addWishlistItem('customer-1', crypto.randomUUID()),
		).rejects.toBeInstanceOf(WishlistProductNotFoundError);
	});

	it('saves a product to the wishlist', async () => {
		const product = await createActiveProduct();

		const wishlist = await addWishlistItem('customer-1', product.id);

		expect(wishlist.productIds).toEqual([product.id]);
	});

	it('is idempotent — saving the same product twice does not duplicate it', async () => {
		const product = await createActiveProduct();

		await addWishlistItem('customer-1', product.id);
		const wishlist = await addWishlistItem('customer-1', product.id);

		expect(wishlist.productIds).toEqual([product.id]);
	});
});
