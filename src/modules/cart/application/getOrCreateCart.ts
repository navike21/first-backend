import CartModel from '../infrastructure/CartModel';

function isDuplicateKeyError(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: unknown }).code === 11000
	);
}

/** Lazily creates a customer's cart on first access. Concurrent first-access
 * calls are safe: the unique index on `customerId` (not just this check)
 * is the real guard, so a duplicate-key race here just re-reads the winner. */
export async function getOrCreateCart(customerId: string) {
	const existing = await CartModel.findOne({ customerId });
	if (existing) return existing;

	try {
		return await CartModel.create({ customerId, items: [] });
	} catch (error) {
		if (isDuplicateKeyError(error)) {
			const cart = await CartModel.findOne({ customerId });
			if (cart) return cart;
		}
		throw error;
	}
}
