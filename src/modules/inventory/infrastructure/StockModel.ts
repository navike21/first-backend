import { Schema, model } from 'mongoose';

export interface StockDocument {
	productId: string;
	// Explicit `null` (not just "absent") for a simple product with no
	// variant — keeps the compound unique index below deterministic to query
	// against, rather than relying on Mongo's "missing field" semantics.
	variantId: string | null;
	locationId: string;
	quantity: number;
}

const StockSchema = new Schema<StockDocument>(
	{
		productId: { type: String, required: true, index: true },
		variantId: { type: String, default: null },
		locationId: { type: String, required: true, index: true },
		quantity: { type: Number, required: true, default: 0, min: 0 },
	},
	{ timestamps: true },
);

// One stock row per product(+variant) per location — `adjustStock` upserts
// against this key instead of ever creating duplicates.
StockSchema.index(
	{ productId: 1, variantId: 1, locationId: 1 },
	{ unique: true },
);

const StockModel = model<StockDocument>('Stock', StockSchema);
export default StockModel;
