import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/services/infrastructure/ServiceModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('@Helpers/generateSlug', () => ({
	generateSlug: vi.fn().mockReturnValue('web-development'),
}));

import { createService } from '@Modules/services/application/createService';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import { ServiceSlugConflictError } from '@Modules/services/domain/errors/ServiceErrors';

const locStr = {
	en: 'a',
	es: 'b',
	de: 'c',
	fr: 'd',
	it: 'e',
	ja: 'f',
	ko: 'g',
	pt: 'h',
	ru: 'i',
	zh: 'j',
};
const validInput = {
	name: locStr,
	shortDescription: locStr,
	description: locStr,
};

describe('createService', () => {
	it('creates service and returns cleaned data', async () => {
		vi.mocked(ServiceModel.findOne).mockResolvedValue(null);
		vi.mocked(ServiceModel.create).mockResolvedValue({
			...validInput,
			id: 'uuid-1',
			slug: 'web-development',
			toObject: vi.fn().mockReturnValue({
				...validInput,
				id: 'uuid-1',
				slug: 'web-development',
				_id: 'mongo-1',
			}),
		} as never);

		const result = await createService(validInput);

		expect(ServiceModel.create).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('uses provided slug', async () => {
		vi.mocked(ServiceModel.findOne).mockResolvedValue(null);
		vi.mocked(ServiceModel.create).mockResolvedValue({
			...validInput,
			slug: 'custom-slug',
			toObject: vi
				.fn()
				.mockReturnValue({ slug: 'custom-slug', _id: 'mongo-1' }),
		} as never);

		await createService({ ...validInput, slug: 'custom-slug' });
		expect(ServiceModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ slug: 'custom-slug' }),
		);
	});

	it('throws ServiceSlugConflictError when slug exists', async () => {
		vi.mocked(ServiceModel.findOne).mockResolvedValue({
			id: 'existing',
		} as never);

		await expect(createService(validInput)).rejects.toThrow(
			ServiceSlugConflictError,
		);
	});
});
