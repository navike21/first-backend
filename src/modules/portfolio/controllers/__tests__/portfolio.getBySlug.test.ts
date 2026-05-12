import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/portfolio/application/getPortfolioBySlug', () => ({ getPortfolioBySlug: vi.fn() }));

import { portfolioGetBySlugController } from '@Modules/portfolio/controllers/portfolio.getBySlug';
import { getPortfolioBySlug } from '@Modules/portfolio/application/getPortfolioBySlug';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('portfolioGetBySlugController', () => {
	it('returns portfolio by slug', async () => {
		vi.mocked(getPortfolioBySlug).mockResolvedValue({ id: '1', slug: 'project' } as never);
		const req = { params: { slug: 'project' } } as unknown as Request;
		const res = makeRes();
		await portfolioGetBySlugController(req, res, vi.fn());
		expect(getPortfolioBySlug).toHaveBeenCalledWith('project');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when not found', async () => {
		vi.mocked(getPortfolioBySlug).mockRejectedValue(new Error('not found'));
		const req = { params: { slug: 'missing' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		portfolioGetBySlugController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
