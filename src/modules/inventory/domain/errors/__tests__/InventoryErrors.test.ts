import { describe, it, expect } from 'vitest';
import { LocationNotFoundError } from '@Modules/inventory/domain/errors/InventoryErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Inventory domain errors', () => {
	it('LocationNotFoundError has correct code and status', () => {
		const error = new LocationNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('LOCATION_NOT_FOUND');
	});
});
