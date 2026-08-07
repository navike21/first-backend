import { getOrCreateCart } from './getOrCreateCart';
import { CartItemNotFoundError } from '../domain/errors/CartErrors';
import type { RemoveCartItemInput } from '../schemas/cart.schema';

export async function removeCartItem(
	customerId: string,
	productId: string,
	input: RemoveCartItemInput,
) {
	const cart = await getOrCreateCart(customerId);
	const index = cart.items.findIndex(
		(i) =>
			i.productId === productId &&
			(i.variantId ?? null) === (input.variantId ?? null),
	);
	if (index === -1) throw new CartItemNotFoundError();

	cart.items.splice(index, 1);
	await cart.save();
	return cart;
}
