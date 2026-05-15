import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updatePortfolio } from '@Modules/portfolio/application/updatePortfolio';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import {
	PortfolioNotFoundError,
	PortfolioSlugConflictError,
} from '@Modules/portfolio/domain/errors/PortfolioErrors';

describe('updatePortfolio', () => {
	it('updates and returns portfolio', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const portfolioDoc = {
			id: '1',
			status: 'draft',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', status: 'published', _id: 'm1' }),
		};
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(portfolioDoc as never);

		const result = await updatePortfolio('1', { status: 'published' });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws PortfolioNotFoundError when not found', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null as never);

		await expect(updatePortfolio('not-found', {})).rejects.toThrow(
			PortfolioNotFoundError,
		);
	});

	it('throws PortfolioSlugConflictError on duplicate slug', async () => {
		const portfolioDoc = { id: '1', save: vi.fn() };
		const conflict = { id: '2', slug: 'taken' };
		vi.mocked(PortfolioModel.findOne)
			.mockResolvedValueOnce(portfolioDoc as never)
			.mockResolvedValueOnce(conflict as never);

		await expect(updatePortfolio('1', { slug: 'taken' })).rejects.toThrow(
			PortfolioSlugConflictError,
		);
	});
});
