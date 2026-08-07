import { ProductModel } from '@Modules/products';
import { getOrCreateWishlist } from './getOrCreateWishlist';
import { WishlistProductNotFoundError } from '../domain/errors/WishlistErrors';

/** Idempotent — saving an already-wishlisted product is a no-op, not an
 * error (matches the usual "favorite/heart" toggle UX). */
export async function addWishlistItem(customerId: string, productId: string) {
	const product = await ProductModel.findOne({
		id: productId,
		deletedAt: null,
		status: 'active',
	});
	if (!product) throw new WishlistProductNotFoundError();

	const wishlist = await getOrCreateWishlist(customerId);
	if (!wishlist.productIds.includes(productId)) {
		wishlist.productIds.push(productId);
		await wishlist.save();
	}
	return wishlist;
}
