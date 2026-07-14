import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getPortfolioById } from '@Modules/portfolio/application/getPortfolioById';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import { PortfolioNotFoundError } from '@Modules/portfolio/domain/errors/PortfolioErrors';

const mockPortfolio = {
	id: '1',
	slug: 'project',
	status: 'draft',
	_id: 'mongo1',
};

describe('getPortfolioById', () => {
	it('returns the portfolio regardless of status', async () => {
		vi.mocked(PortfolioModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(mockPortfolio),
		} as never);

		const result = await getPortfolioById('1');

		expect(PortfolioModel.findOne).toHaveBeenCalledWith({
			id: '1',
			deletedAt: null,
		});
		expect(result.id).toBe('1');
		expect(result.status).toBe('draft');
	});

	it('throws PortfolioNotFoundError when not found or soft-deleted', async () => {
		vi.mocked(PortfolioModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);

		await expect(getPortfolioById('missing')).rejects.toThrow(
			PortfolioNotFoundError,
		);
	});
});
