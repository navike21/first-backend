import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { findOne: vi.fn() },
}));

import { deletePortfolioLogical } from '@Modules/portfolio/application/deletePortfolioLogical';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import { PortfolioNotFoundError } from '@Modules/portfolio/domain/errors/PortfolioErrors';

describe('deletePortfolioLogical', () => {
	it('soft-deletes portfolio', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const portfolioDoc = {
			id: '1',
			status: 'published',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', status: 'deleted', _id: 'm1' }),
		};
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(portfolioDoc as never);

		const result = await deletePortfolioLogical('1');

		expect(saveFn).toHaveBeenCalled();
		expect(portfolioDoc.status).toBe('deleted');
		expect(result).not.toHaveProperty('_id');
	});

	it('throws PortfolioNotFoundError when not found', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null as never);

		await expect(deletePortfolioLogical('not-found')).rejects.toThrow(
			PortfolioNotFoundError,
		);
	});
});
