import { ProductModel } from '@Modules/products';
import { getOrCreateCart } from './getOrCreateCart';
import { resolveAvailableStock } from './resolveAvailableStock';
import {
	CartProductNotFoundError,
	CartVariantNotFoundError,
	CartVariantRequiredError,
	CartOutOfStockError,
} from '../domain/errors/CartErrors';
import type { AddCartItemInput } from '../schemas/cart.schema';

export async function addCartItem(customerId: string, input: AddCartItemInput) {
	const product = await ProductModel.findOne({
		id: input.productId,
		deletedAt: null,
		status: 'active',
	});
	if (!product) throw new CartProductNotFoundError();

	if (product.hasVariants) {
		if (!input.variantId) throw new CartVariantRequiredError();
		const variantExists = product.variants.some((v) => v.id === input.variantId);
		if (!variantExists) throw new CartVariantNotFoundError();
	}

	const cart = await getOrCreateCart(customerId);
	const existingItem = cart.items.find(
		(item) =>
			item.productId === input.productId &&
			(item.variantId ?? null) === (input.variantId ?? null),
	);
	const nextQuantity = (existingItem?.quantity ?? 0) + input.quantity;

	const available = await resolveAvailableStock(input.productId, input.variantId);
	if (nextQuantity > available) throw new CartOutOfStockError();

	if (existingItem) {
		existingItem.quantity = nextQuantity;
	} else {
		cart.items.push({
			productId: input.productId,
			variantId: input.variantId ?? null,
			quantity: input.quantity,
			addedAt: new Date(),
		});
	}

	await cart.save();
	return cart;
}
