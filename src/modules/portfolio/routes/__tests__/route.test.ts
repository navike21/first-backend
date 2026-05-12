import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/portfolio/application/createPortfolio', () => ({ createPortfolio: vi.fn() }));
vi.mock('@Modules/portfolio/application/listPortfolioPublic', () => ({ listPortfolioPublic: vi.fn() }));
vi.mock('@Modules/portfolio/application/listPortfolioAdmin', () => ({ listPortfolioAdmin: vi.fn() }));
vi.mock('@Modules/portfolio/application/listPortfolioByService', () => ({ listPortfolioByService: vi.fn() }));
vi.mock('@Modules/portfolio/application/getPortfolioBySlug', () => ({ getPortfolioBySlug: vi.fn() }));
vi.mock('@Modules/portfolio/application/updatePortfolio', () => ({ updatePortfolio: vi.fn() }));
vi.mock('@Modules/portfolio/application/deletePortfolioLogical', () => ({ deletePortfolioLogical: vi.fn() }));

import { Router } from 'express';
import { portfolioApi } from '@Modules/portfolio/routes/route';

describe('portfolioApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => portfolioApi(router)).not.toThrow();
	});
});
