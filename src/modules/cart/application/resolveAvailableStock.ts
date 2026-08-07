import { getStockByProduct } from '@Modules/inventory';

/** Aggregate available quantity for a product, or for one specific variant
 * when `variantId` is given — `getStockByProduct`'s `total` sums every row
 * for the product regardless of variant, so a variant product needs its own
 * filtered sum instead. */
export async function resolveAvailableStock(
	productId: string,
	variantId?: string,
): Promise<number> {
	const stock = await getStockByProduct(productId);
	if (!variantId) return stock.total;
	return stock.byLocation
		.filter((row) => row.variantId === variantId)
		.reduce((sum, row) => sum + row.quantity, 0);
}
