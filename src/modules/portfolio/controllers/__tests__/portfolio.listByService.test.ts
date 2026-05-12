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
vi.mock('@Modules/portfolio/application/listPortfolioByService', () => ({
	listPortfolioByService: vi.fn(),
}));

import { portfolioListByServiceController } from '@Modules/portfolio/controllers/portfolio.listByService';
import { listPortfolioByService } from '@Modules/portfolio/application/listPortfolioByService';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('portfolioListByServiceController', () => {
	it('returns portfolio list filtered by service', async () => {
		vi.mocked(listPortfolioByService).mockResolvedValue({
			data: [{ id: '1', slug: 'proj' }],
			meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
		} as never);
		const req = {
			params: { serviceSlug: 'web' },
			query: { page: '1', limit: '10' },
		} as unknown as Request;
		const res = makeRes();
		await portfolioListByServiceController(req, res, vi.fn());
		expect(listPortfolioByService).toHaveBeenCalledWith(
			expect.objectContaining({ serviceSlug: 'web' }),
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when service not found', async () => {
		vi.mocked(listPortfolioByService).mockRejectedValue(new Error('not found'));
		const req = {
			params: { serviceSlug: 'missing' },
			query: {},
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		portfolioListByServiceController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
