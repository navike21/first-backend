import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/services/infrastructure/ServiceModel', () => ({
	default: { findOne: vi.fn() },
}));

import { deleteServiceLogical } from '@Modules/services/application/deleteServiceLogical';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import { ServiceNotFoundError } from '@Modules/services/domain/errors/ServiceErrors';

describe('deleteServiceLogical', () => {
	it('soft-deletes service', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const serviceDoc = {
			id: '1',
			status: 'active',
			deletedAt: undefined as Date | undefined,
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', deletedAt: new Date(), _id: 'm1' }),
		};
		vi.mocked(ServiceModel.findOne).mockResolvedValue(serviceDoc as never);

		const result = await deleteServiceLogical('1');

		expect(saveFn).toHaveBeenCalled();
		// Soft-delete is recorded via deletedAt (there is no 'deleted' status).
		expect(serviceDoc.deletedAt).toBeInstanceOf(Date);
		expect(result).not.toHaveProperty('_id');
	});

	it('throws ServiceNotFoundError when not found', async () => {
		vi.mocked(ServiceModel.findOne).mockResolvedValue(null as never);

		await expect(deleteServiceLogical('not-found')).rejects.toThrow(
			ServiceNotFoundError,
		);
	});
});
