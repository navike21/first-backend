import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { getOrCreateWishlist } from '@Modules/wishlist/application/getOrCreateWishlist';
import WishlistModel from '@Modules/wishlist/infrastructure/WishlistModel';

withMongo();

describe('getOrCreateWishlist', () => {
	it('creates an empty wishlist on first access', async () => {
		const wishlist = await getOrCreateWishlist('customer-1');

		expect(wishlist.customerId).toBe('customer-1');
		expect(wishlist.productIds).toHaveLength(0);
	});

	it('returns the same wishlist on subsequent access', async () => {
		const first = await getOrCreateWishlist('customer-2');
		await WishlistModel.updateOne(
			{ id: first.id },
			{ $push: { productIds: 'p1' } },
		);

		const second = await getOrCreateWishlist('customer-2');

		expect(second.id).toBe(first.id);
		expect(second.productIds).toEqual(['p1']);
	});

	it('never creates two wishlists for the same customer under a race', async () => {
		const [a, b] = await Promise.all([
			getOrCreateWishlist('customer-3'),
			getOrCreateWishlist('customer-3'),
		]);

		expect(a.id).toBe(b.id);
		const count = await WishlistModel.countDocuments({
			customerId: 'customer-3',
		});
		expect(count).toBe(1);
	});
});
