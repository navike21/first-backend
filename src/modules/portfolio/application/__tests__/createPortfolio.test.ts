import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('@Helpers/generateSlug', () => ({
	generateSlug: vi.fn().mockReturnValue('project-name'),
}));

import { createPortfolio } from '@Modules/portfolio/application/createPortfolio';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import { PortfolioSlugConflictError } from '@Modules/portfolio/domain/errors/PortfolioErrors';

const ls = {
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
	name: ls,
	shortDescription: ls,
	description: ls,
	coverImageUrl: 'https://example.com/cover.jpg',
	serviceIds: ['550e8400-e29b-41d4-a716-446655440000'],
	startDate: '2024-01-01',
	gallery: [],
	technologies: [],
	metrics: [],
	featured: false,
	order: 0,
	status: 'draft' as const,
};

describe('createPortfolio', () => {
	it('creates portfolio and returns cleaned data', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null);
		vi.mocked(PortfolioModel.create).mockResolvedValue({
			...validInput,
			id: 'uuid-1',
			slug: 'project-name',
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: 'uuid-1', _id: 'mongo-1' }),
		} as never);

		const result = await createPortfolio(validInput);

		expect(PortfolioModel.create).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
		expect(result.warnings).toEqual([]);
	});

	it('throws PortfolioSlugConflictError when slug exists', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue({
			id: 'existing',
		} as never);

		await expect(createPortfolio(validInput)).rejects.toThrow(
			PortfolioSlugConflictError,
		);
	});

	it('throws when no cover image is provided (no file, no url)', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null);
		const { coverImageUrl: _cover, ...withoutCover } = validInput;

		await expect(
			createPortfolio(withoutCover as typeof validInput),
		).rejects.toMatchObject({ code: 'PORTFOLIO_COVER_REQUIRED' });
		expect(PortfolioModel.create).not.toHaveBeenCalled();
	});
});
