import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/services/infrastructure/ServiceModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateService } from '@Modules/services/application/updateService';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import {
	ServiceNotFoundError,
	ServiceSlugConflictError,
} from '@Modules/services/domain/errors/ServiceErrors';

describe('updateService', () => {
	it('updates and returns service', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const serviceDoc = {
			id: '1',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', isActive: false, _id: 'm1' }),
		};
		vi.mocked(ServiceModel.findOne).mockResolvedValue(serviceDoc as never);

		const result = await updateService('1', { isActive: false });

		expect(saveFn).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
	});

	it('throws ServiceNotFoundError when not found', async () => {
		vi.mocked(ServiceModel.findOne).mockResolvedValue(null as never);

		await expect(updateService('not-found', {})).rejects.toThrow(
			ServiceNotFoundError,
		);
	});

	it('throws ServiceSlugConflictError on duplicate slug', async () => {
		const serviceDoc = { id: '1', save: vi.fn() };
		const conflict = { id: '2', slug: 'taken' };
		vi.mocked(ServiceModel.findOne)
			.mockResolvedValueOnce(serviceDoc as never)
			.mockResolvedValueOnce(conflict as never);

		await expect(updateService('1', { slug: 'taken' })).rejects.toThrow(
			ServiceSlugConflictError,
		);
	});
});
