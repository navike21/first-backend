import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/inventory/infrastructure/LocationModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateLocation } from '@Modules/inventory/application/updateLocation';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';
import { LocationNotFoundError } from '@Modules/inventory/domain/errors/InventoryErrors';

describe('updateLocation', () => {
	it('updates and returns the location', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			name: 'Old name',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', name: 'New name', _id: 'mongo1' }),
		};
		vi.mocked(LocationModel.findOne).mockResolvedValue(doc as never);

		const result = await updateLocation('1', { name: 'New name' });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws LocationNotFoundError when the location does not exist', async () => {
		vi.mocked(LocationModel.findOne).mockResolvedValue(null as never);

		await expect(updateLocation('missing', {})).rejects.toThrow(
			LocationNotFoundError,
		);
	});
});
