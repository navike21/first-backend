import { describe, it, expect } from 'vitest';
import {
	CreateLocationSchema,
	UpdateLocationSchema,
	ListLocationsQuerySchema,
} from '@Modules/inventory/schemas/location.schema';

const validLocation = {
	name: 'Almacén Central Lima',
	type: 'warehouse',
};

describe('location.schema', () => {
	it('CreateLocationSchema parses valid minimal data', () => {
		const result = CreateLocationSchema.safeParse(validLocation);
		expect(result.success).toBe(true);
	});

	it('CreateLocationSchema rejects missing name', () => {
		const result = CreateLocationSchema.safeParse({ type: 'warehouse' });
		expect(result.success).toBe(false);
	});

	it('CreateLocationSchema rejects an invalid type', () => {
		const result = CreateLocationSchema.safeParse({
			...validLocation,
			type: 'factory',
		});
		expect(result.success).toBe(false);
	});

	it('CreateLocationSchema defaults fulfillsOnline and isActive to true', () => {
		const result = CreateLocationSchema.safeParse(validLocation);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.fulfillsOnline).toBe(true);
			expect(result.data.isActive).toBe(true);
		}
	});

	it('CreateLocationSchema accepts an optional address', () => {
		const result = CreateLocationSchema.safeParse({
			...validLocation,
			address: { country: 'PE', region: 'Lima' },
		});
		expect(result.success).toBe(true);
	});

	it('UpdateLocationSchema allows empty object', () => {
		expect(UpdateLocationSchema.safeParse({}).success).toBe(true);
	});

	it('ListLocationsQuerySchema defaults page and limit', () => {
		const result = ListLocationsQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});
});
