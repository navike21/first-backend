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
vi.mock('@Modules/portfolio/application/createPortfolio', () => ({
	createPortfolio: vi.fn(),
}));

import { portfolioCreateController } from '@Modules/portfolio/controllers/portfolio.create';
import { createPortfolio } from '@Modules/portfolio/application/createPortfolio';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const ls = {
	en: 'a',
	es: 'b',
	de: 'c',
	fr: 'd',
	it: 'e',
	ja: 'f',
	ko: 'g',
	pt: 'h',
	ru: 'i',
	zh: 'j',
};
const validBody = {
	name: ls,
	shortDescription: ls,
	description: ls,
	coverImageUrl: 'https://example.com/img.jpg',
	serviceIds: ['550e8400-e29b-41d4-a716-446655440000'],
	startDate: '2024-01-01',
};

describe('portfolioCreateController', () => {
	it('calls createPortfolio and returns 201', async () => {
		vi.mocked(createPortfolio).mockResolvedValue({
			id: '1',
			slug: 'project',
		} as never);
		const req = { body: validBody } as unknown as Request;
		const res = makeRes();
		await portfolioCreateController(req, res, vi.fn());
		expect(createPortfolio).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await portfolioCreateController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
