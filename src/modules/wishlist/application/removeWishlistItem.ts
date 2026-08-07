import { getOrCreateWishlist } from './getOrCreateWishlist';
import { WishlistItemNotFoundError } from '../domain/errors/WishlistErrors';

export async function removeWishlistItem(customerId: string, productId: string) {
	const wishlist = await getOrCreateWishlist(customerId);
	const index = wishlist.productIds.indexOf(productId);
	if (index === -1) throw new WishlistItemNotFoundError();

	wishlist.productIds.splice(index, 1);
	await wishlist.save();
	return wishlist;
}
