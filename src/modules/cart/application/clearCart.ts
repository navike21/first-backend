import { getOrCreateCart } from './getOrCreateCart';

export async function clearCart(customerId: string) {
	const cart = await getOrCreateCart(customerId);
	cart.items = [];
	await cart.save();
	return cart;
}
