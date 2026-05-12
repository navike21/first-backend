import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/clients/infrastructure/ClientModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/services/infrastructure/ServiceModel', () => ({
	default: { find: vi.fn() },
}));

import { getPortfolioBySlug } from '@Modules/portfolio/application/getPortfolioBySlug';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import ClientModel from '@Modules/clients/infrastructure/ClientModel';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import { PortfolioNotFoundError } from '@Modules/portfolio/domain/errors/PortfolioErrors';

const mockPortfolio = {
	id: '1',
	slug: 'project',
	clientId: 'client-uuid',
	serviceIds: ['svc-uuid'],
	_id: 'mongo1',
};

describe('getPortfolioBySlug', () => {
	it('returns portfolio with client and services', async () => {
		vi.mocked(PortfolioModel.findOne).mockReturnValue({ lean: vi.fn().mockResolvedValue(mockPortfolio) } as never);
		vi.mocked(ClientModel.findOne).mockReturnValue({
			select: vi.fn().mockReturnThis(),
			lean: vi.fn().mockResolvedValue({ businessName: 'Acme', logoUrl: null, _id: 'm2' }),
		} as never);
		vi.mocked(ServiceModel.find).mockReturnValue({
			select: vi.fn().mockReturnThis(),
			lean: vi.fn().mockResolvedValue([{ id: 'svc-uuid', slug: 'web', _id: 'm3' }]),
		} as never);

		const result = await getPortfolioBySlug('project');

		expect(result.slug).toBe('project');
		expect(result.client).toBeDefined();
		expect(Array.isArray(result.services)).toBe(true);
	});

	it('returns null client when clientId missing', async () => {
		const portfolioNoClient = { ...mockPortfolio, clientId: undefined, serviceIds: [] };
		vi.mocked(PortfolioModel.findOne).mockReturnValue({ lean: vi.fn().mockResolvedValue(portfolioNoClient) } as never);
		vi.mocked(ServiceModel.find).mockReturnValue({
			select: vi.fn().mockReturnThis(),
			lean: vi.fn().mockResolvedValue([]),
		} as never);

		const result = await getPortfolioBySlug('project');

		expect(result.client).toBeNull();
		expect(result.services).toHaveLength(0);
	});

	it('throws PortfolioNotFoundError when not found', async () => {
		vi.mocked(PortfolioModel.findOne).mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as never);

		await expect(getPortfolioBySlug('not-found')).rejects.toThrow(PortfolioNotFoundError);
	});
});
