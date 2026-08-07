import WishlistModel from '../infrastructure/WishlistModel';

function isDuplicateKeyError(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: unknown }).code === 11000
	);
}

/** Lazily creates a customer's wishlist on first access — same
 * duplicate-key-safe pattern as cart's `getOrCreateCart`. */
export async function getOrCreateWishlist(customerId: string) {
	const existing = await WishlistModel.findOne({ customerId });
	if (existing) return existing;

	try {
		return await WishlistModel.create({ customerId, productIds: [] });
	} catch (error) {
		if (isDuplicateKeyError(error)) {
			const wishlist = await WishlistModel.findOne({ customerId });
			if (wishlist) return wishlist;
		}
		throw error;
	}
}
