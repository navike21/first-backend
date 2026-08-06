import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/inventory/infrastructure/LocationModel', () => ({
	default: { create: vi.fn() },
}));

import { createLocation } from '@Modules/inventory/application/createLocation';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';

const validInput = { name: 'Almacén Central Lima', type: 'warehouse' as const };

describe('createLocation', () => {
	it('creates a location and returns cleaned data', async () => {
		vi.mocked(LocationModel.create).mockResolvedValue({
			...validInput,
			id: '1',
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: '1', _id: 'mongo1' }),
		} as never);

		const result = await createLocation(validInput);

		expect(LocationModel.create).toHaveBeenCalledWith(validInput);
		expect(result).not.toHaveProperty('_id');
	});
});
