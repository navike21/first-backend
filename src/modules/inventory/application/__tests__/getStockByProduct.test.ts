import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { getStockByProduct } from '@Modules/inventory/application/getStockByProduct';
import StockModel from '@Modules/inventory/infrastructure/StockModel';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';

withMongo();

describe('getStockByProduct', () => {
	it('returns zero total and an empty breakdown when there is no stock', async () => {
		const result = await getStockByProduct('nonexistent-product');

		expect(result.total).toBe(0);
		expect(result.byLocation).toEqual([]);
	});

	it('aggregates the total across locations and resolves location names', async () => {
		const warehouse = await LocationModel.create({
			name: 'Almacén Central',
			type: 'warehouse',
		});
		const store = await LocationModel.create({
			name: 'Tienda Miraflores',
			type: 'store',
		});
		await StockModel.create({
			productId: 'prod-1',
			variantId: null,
			locationId: warehouse.id,
			quantity: 15,
		});
		await StockModel.create({
			productId: 'prod-1',
			variantId: null,
			locationId: store.id,
			quantity: 5,
		});

		const result = await getStockByProduct('prod-1');

		expect(result.total).toBe(20);
		expect(result.byLocation).toHaveLength(2);
		const byLocationId = new Map(
			result.byLocation.map((l) => [l.locationId, l]),
		);
		expect(byLocationId.get(warehouse.id)?.locationName).toBe(
			'Almacén Central',
		);
		expect(byLocationId.get(warehouse.id)?.quantity).toBe(15);
		expect(byLocationId.get(store.id)?.quantity).toBe(5);
	});

	it('includes variant-level rows in the breakdown', async () => {
		const location = await LocationModel.create({
			name: 'Almacén',
			type: 'warehouse',
		});
		await StockModel.create({
			productId: 'prod-2',
			variantId: 'var-s',
			locationId: location.id,
			quantity: 3,
		});
		await StockModel.create({
			productId: 'prod-2',
			variantId: 'var-m',
			locationId: location.id,
			quantity: 4,
		});

		const result = await getStockByProduct('prod-2');

		expect(result.total).toBe(7);
		expect(result.byLocation).toHaveLength(2);
	});
});
