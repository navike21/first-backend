import { getOrCreateCart } from './getOrCreateCart';
import { resolveAvailableStock } from './resolveAvailableStock';
import { CartItemNotFoundError, CartOutOfStockError } from '../domain/errors/CartErrors';
import type { UpdateCartItemQuantityInput } from '../schemas/cart.schema';

export async function updateCartItemQuantity(
	customerId: string,
	productId: string,
	input: UpdateCartItemQuantityInput,
) {
	const cart = await getOrCreateCart(customerId);
	const item = cart.items.find(
		(i) =>
			i.productId === productId &&
			(i.variantId ?? null) === (input.variantId ?? null),
	);
	if (!item) throw new CartItemNotFoundError();

	const available = await resolveAvailableStock(productId, input.variantId);
	if (input.quantity > available) throw new CartOutOfStockError();

	item.quantity = input.quantity;
	await cart.save();
	return cart;
}
