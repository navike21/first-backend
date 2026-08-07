import { model, Schema } from 'mongoose';
import generateUUID from '@Helpers/uuid';

export interface CartItem {
	productId: string;
	variantId: string | null;
	quantity: number;
	addedAt: Date;
}

export interface CartDocument {
	id: string;
	customerId: string;
	items: CartItem[];
	createdAt: Date;
	updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>(
	{
		productId: { type: String, required: true },
		variantId: { type: String, default: null },
		quantity: { type: Number, required: true, min: 1 },
		addedAt: { type: Date, default: Date.now },
	},
	{ _id: false },
);

const cartSchema = new Schema<CartDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		// One cart per customer — enforced here, not just at the application
		// layer, so a race between two concurrent "get or create" calls can
		// never produce two carts for the same customer.
		customerId: { type: String, required: true, unique: true },
		items: [CartItemSchema],
	},
	{ timestamps: true },
);

export default model<CartDocument>('Cart', cartSchema);
