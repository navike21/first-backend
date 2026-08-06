import StockModel from '../infrastructure/StockModel';
import LocationModel from '../infrastructure/LocationModel';

export interface StockByLocation {
	locationId: string;
	locationName: string;
	variantId: string | null;
	quantity: number;
}

export interface StockSummary {
	productId: string;
	total: number;
	byLocation: StockByLocation[];
}

export async function getStockByProduct(
	productId: string,
): Promise<StockSummary> {
	const rows = await StockModel.find({ productId }).lean();

	if (rows.length === 0) {
		return { productId, total: 0, byLocation: [] };
	}

	const locationIds = [...new Set(rows.map((r) => r.locationId))];
	const locations = await LocationModel.find({ id: { $in: locationIds } })
		.select('id name')
		.lean();
	const nameById = new Map(locations.map((l) => [l.id, l.name]));

	const byLocation = rows.map((r) => ({
		locationId: r.locationId,
		locationName: nameById.get(r.locationId) ?? r.locationId,
		variantId: r.variantId,
		quantity: r.quantity,
	}));

	const total = rows.reduce((sum, r) => sum + r.quantity, 0);

	return { productId, total, byLocation };
}
