import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/inventory/infrastructure/LocationModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getLocationById } from '@Modules/inventory/application/getLocationById';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';
import { LocationNotFoundError } from '@Modules/inventory/domain/errors/InventoryErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('getLocationById', () => {
	it('returns location data when found', async () => {
		vi.mocked(LocationModel.findOne).mockReturnValue(
			mockQueryBuilder({ id: '1', name: 'Almacén', _id: 'mongo1' }) as never,
		);

		const result = await getLocationById('1');

		expect(result).not.toHaveProperty('_id');
		expect(result.name).toBe('Almacén');
	});

	it('throws LocationNotFoundError when not found', async () => {
		vi.mocked(LocationModel.findOne).mockReturnValue(
			mockQueryBuilder(null) as never,
		);

		await expect(getLocationById('not-found')).rejects.toThrow(
			LocationNotFoundError,
		);
	});
});
