import { describe, it, expect } from 'vitest';
import { AdjustStockSchema } from '@Modules/inventory/schemas/stock.schema';

const validStock = {
	productId: '550e8400-e29b-41d4-a716-446655440000',
	locationId: '550e8400-e29b-41d4-a716-446655440001',
	quantity: 10,
};

describe('stock.schema', () => {
	it('AdjustStockSchema parses valid data', () => {
		const result = AdjustStockSchema.safeParse(validStock);
		expect(result.success).toBe(true);
	});

	it('AdjustStockSchema accepts an optional variantId', () => {
		const result = AdjustStockSchema.safeParse({
			...validStock,
			variantId: '550e8400-e29b-41d4-a716-446655440002',
		});
		expect(result.success).toBe(true);
	});

	it('AdjustStockSchema rejects a negative quantity', () => {
		const result = AdjustStockSchema.safeParse({
			...validStock,
			quantity: -1,
		});
		expect(result.success).toBe(false);
	});

	it('AdjustStockSchema rejects a non-integer quantity', () => {
		const result = AdjustStockSchema.safeParse({
			...validStock,
			quantity: 1.5,
		});
		expect(result.success).toBe(false);
	});

	it('AdjustStockSchema rejects a non-uuid productId', () => {
		const result = AdjustStockSchema.safeParse({
			...validStock,
			productId: 'not-a-uuid',
		});
		expect(result.success).toBe(false);
	});
});
