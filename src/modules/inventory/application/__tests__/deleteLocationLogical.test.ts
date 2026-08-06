import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/inventory/infrastructure/LocationModel', () => ({
	default: { findOne: vi.fn() },
}));

import { deleteLocationLogical } from '@Modules/inventory/application/deleteLocationLogical';
import LocationModel from '@Modules/inventory/infrastructure/LocationModel';
import { LocationNotFoundError } from '@Modules/inventory/domain/errors/InventoryErrors';

describe('deleteLocationLogical', () => {
	it('soft-deletes the location and returns data', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			save: saveFn,
			toObject: vi.fn().mockReturnValue({ id: '1', _id: 'mongo1' }),
		};
		vi.mocked(LocationModel.findOne).mockResolvedValue(doc as never);

		const result = await deleteLocationLogical('1');

		expect(saveFn).toHaveBeenCalled();
		expect((doc as { deletedAt?: Date }).deletedAt).toBeInstanceOf(Date);
		expect(result).not.toHaveProperty('_id');
	});

	it('throws LocationNotFoundError when the location does not exist', async () => {
		vi.mocked(LocationModel.findOne).mockResolvedValue(null as never);

		await expect(deleteLocationLogical('not-found')).rejects.toThrow(
			LocationNotFoundError,
		);
	});
});
