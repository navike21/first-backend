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
vi.mock('@Modules/portfolio/application/getPortfolioById', () => ({
	getPortfolioById: vi.fn(),
}));

import { portfolioGetByIdController } from '@Modules/portfolio/controllers/portfolio.getById';
import { getPortfolioById } from '@Modules/portfolio/application/getPortfolioById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('portfolioGetByIdController', () => {
	it('returns portfolio by id', async () => {
		vi.mocked(getPortfolioById).mockResolvedValue({
			id: '1',
			slug: 'project',
		} as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		await portfolioGetByIdController(req, res, vi.fn());
		expect(getPortfolioById).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when not found', async () => {
		vi.mocked(getPortfolioById).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'missing' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		portfolioGetByIdController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
