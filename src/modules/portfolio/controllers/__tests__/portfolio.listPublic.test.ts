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
vi.mock('@Modules/portfolio/application/listPortfolioPublic', () => ({ listPortfolioPublic: vi.fn() }));

import { portfolioListPublicController } from '@Modules/portfolio/controllers/portfolio.listPublic';
import { listPortfolioPublic } from '@Modules/portfolio/application/listPortfolioPublic';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('portfolioListPublicController', () => {
	it('returns portfolio list with meta', async () => {
		vi.mocked(listPortfolioPublic).mockResolvedValue({
			data: [{ id: '1', slug: 'proj' }],
			meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
		} as never);
		const req = { query: { page: '1', limit: '10' } } as unknown as Request;
		const res = makeRes();
		await portfolioListPublicController(req, res, vi.fn());
		expect(listPortfolioPublic).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when application throws', async () => {
		vi.mocked(listPortfolioPublic).mockRejectedValue(new Error('not found'));
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		portfolioListPublicController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
