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
vi.mock('@Modules/portfolio/application/deletePortfolioLogical', () => ({ deletePortfolioLogical: vi.fn() }));

import { portfolioDeleteController } from '@Modules/portfolio/controllers/portfolio.delete';
import { deletePortfolioLogical } from '@Modules/portfolio/application/deletePortfolioLogical';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('portfolioDeleteController', () => {
	it('calls deletePortfolioLogical and returns 200', async () => {
		vi.mocked(deletePortfolioLogical).mockResolvedValue({ id: '1', status: 'deleted' } as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		await portfolioDeleteController(req, res, vi.fn());
		expect(deletePortfolioLogical).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when not found', async () => {
		vi.mocked(deletePortfolioLogical).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'missing' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		portfolioDeleteController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
