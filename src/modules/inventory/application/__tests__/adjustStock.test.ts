import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { adjustStock } from '@Modules/inventory/application/adjustStock';
import StockModel from '@Modules/inventory/infrastructure/StockModel';

withMongo();

describe('adjustStock', () => {
	it('creates a stock row on first adjustment', async () => {
		const result = await adjustStock({
			productId: 'prod-1',
			locationId: 'loc-1',
			quantity: 10,
		});

		expect(result.quantity).toBe(10);
		const doc = await StockModel.findOne({
			productId: 'prod-1',
			locationId: 'loc-1',
		}).lean();
		expect(doc!.quantity).toBe(10);
		expect(doc!.variantId).toBeNull();
	});

	it('sets the absolute quantity on a subsequent adjustment (not an increment)', async () => {
		await adjustStock({
			productId: 'prod-2',
			locationId: 'loc-1',
			quantity: 5,
		});
		await adjustStock({
			productId: 'prod-2',
			locationId: 'loc-1',
			quantity: 20,
		});

		const rows = await StockModel.find({ productId: 'prod-2' }).lean();
		expect(rows).toHaveLength(1);
		expect(rows[0].quantity).toBe(20);
	});

	it('keeps separate rows per variant at the same location', async () => {
		await adjustStock({
			productId: 'prod-3',
			variantId: 'var-s',
			locationId: 'loc-1',
			quantity: 3,
		});
		await adjustStock({
			productId: 'prod-3',
			variantId: 'var-m',
			locationId: 'loc-1',
			quantity: 7,
		});

		const rows = await StockModel.find({ productId: 'prod-3' }).lean();
		expect(rows).toHaveLength(2);
	});

	it('keeps separate rows per location for the same product', async () => {
		await adjustStock({
			productId: 'prod-4',
			locationId: 'loc-1',
			quantity: 2,
		});
		await adjustStock({
			productId: 'prod-4',
			locationId: 'loc-2',
			quantity: 9,
		});

		const rows = await StockModel.find({ productId: 'prod-4' }).lean();
		expect(rows).toHaveLength(2);
	});
});
