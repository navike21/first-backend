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
vi.mock('@Modules/pages/application/updatePage', () => ({
	updatePage: vi.fn(),
}));

import { pageUpdateController } from '@Modules/pages/controllers/page.update';
import { updatePage } from '@Modules/pages/application/updatePage';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageUpdateController', () => {
	it('calls updatePage and returns 200 on valid input', async () => {
		vi.mocked(updatePage).mockResolvedValue({
			id: '1',
			slug: 'home',
		} as never);
		const req = {
			params: { slug: 'home' },
			body: { isPublished: true },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageUpdateController(req, res, next);

		expect(updatePage).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = {
			params: { slug: 'home' },
			body: { slug: 'INVALID SLUG!' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageUpdateController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
