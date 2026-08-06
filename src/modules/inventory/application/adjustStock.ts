import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import StockModel from '../infrastructure/StockModel';
import type { AdjustStockInput } from '../schemas/stock.schema';

/**
 * Sets the absolute quantity for a product(+variant) at a location — not an
 * increment. Matches the plan's "editable inline" admin UI: a staff member
 * types the new total, not a delta.
 */
export async function adjustStock(input: AdjustStockInput) {
	const variantId = input.variantId ?? null;

	const doc = await StockModel.findOneAndUpdate(
		{ productId: input.productId, variantId, locationId: input.locationId },
		{ $set: { quantity: input.quantity } },
		{ new: true, upsert: true, setDefaultsOnInsert: true },
	).lean();

	return cleanMongoFields(doc);
}
