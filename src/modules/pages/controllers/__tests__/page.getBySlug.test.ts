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
vi.mock('@Modules/pages/application/getPageBySlug', () => ({
	getPageBySlug: vi.fn(),
}));

import { pageGetBySlugPublicController } from '@Modules/pages/controllers/page.getBySlug';
import { getPageBySlug } from '@Modules/pages/application/getPageBySlug';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageGetBySlugPublicController', () => {
	it('calls getPageBySlug and returns 200', async () => {
		vi.mocked(getPageBySlug).mockResolvedValue({
			id: '1',
			slug: 'home',
		} as never);
		const req = { params: { slug: 'home' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageGetBySlugPublicController(req, res, next);

		expect(getPageBySlug).toHaveBeenCalledWith('home', false);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when page not found', async () => {
		vi.mocked(getPageBySlug).mockRejectedValue(new Error('not found'));
		const req = { params: { slug: 'bad' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		pageGetBySlugPublicController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
