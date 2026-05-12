import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/services/infrastructure/ServiceModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getServiceBySlug } from '@Modules/services/application/getServiceBySlug';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import { ServiceNotFoundError } from '@Modules/services/domain/errors/ServiceErrors';

const mockQB = (result: unknown) => ({ lean: vi.fn().mockResolvedValue(result) });

describe('getServiceBySlug', () => {
	it('returns service when found', async () => {
		vi.mocked(ServiceModel.findOne).mockReturnValue(mockQB({ id: '1', slug: 'web', _id: 'm1' }) as never);

		const result = await getServiceBySlug('web');

		expect(result).not.toHaveProperty('_id');
		expect(result.slug).toBe('web');
	});

	it('throws ServiceNotFoundError when not found', async () => {
		vi.mocked(ServiceModel.findOne).mockReturnValue(mockQB(null) as never);

		await expect(getServiceBySlug('not-found')).rejects.toThrow(ServiceNotFoundError);
	});
});
