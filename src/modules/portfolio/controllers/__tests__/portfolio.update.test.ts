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
vi.mock('@Modules/portfolio/application/updatePortfolio', () => ({
	updatePortfolio: vi.fn(),
}));

import { portfolioUpdateController } from '@Modules/portfolio/controllers/portfolio.update';
import { updatePortfolio } from '@Modules/portfolio/application/updatePortfolio';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('portfolioUpdateController', () => {
	it('calls updatePortfolio and returns 200', async () => {
		vi.mocked(updatePortfolio).mockResolvedValue({
			data: { id: '1', slug: 'project' },
			warnings: [],
		} as never);
		const req = {
			params: { id: '1' },
			body: { status: 'published' },
		} as unknown as Request;
		const res = makeRes();
		await portfolioUpdateController(req, res, vi.fn());
		expect(updatePortfolio).toHaveBeenCalledWith(
			'1',
			expect.any(Object),
			undefined,
			undefined,
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = {
			params: { id: '1' },
			body: { serviceIds: 'not-an-array' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await portfolioUpdateController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
