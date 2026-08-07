import { model, Schema } from 'mongoose';
import generateUUID from '@Helpers/uuid';

export interface WishlistDocument {
	id: string;
	customerId: string;
	productIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

const wishlistSchema = new Schema<WishlistDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		// One wishlist per customer — same precedent as Cart's unique index.
		customerId: { type: String, required: true, unique: true },
		productIds: [{ type: String }],
	},
	{ timestamps: true },
);

export default model<WishlistDocument>('Wishlist', wishlistSchema);
