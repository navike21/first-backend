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
vi.mock('@Modules/pages/application/reorderSections', () => ({
	reorderSections: vi.fn(),
}));

import { pageSectionReorderController } from '@Modules/pages/controllers/page.section.reorder';
import { reorderSections } from '@Modules/pages/application/reorderSections';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageSectionReorderController', () => {
	it('calls reorderSections and returns 200 on valid input', async () => {
		vi.mocked(reorderSections).mockResolvedValue({ id: '1' } as never);
		const req = {
			params: { slug: 'home' },
			body: { order: ['sec-2', 'sec-1'] },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageSectionReorderController(req, res, next);

		expect(reorderSections).toHaveBeenCalledWith('home', ['sec-2', 'sec-1']);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on empty order array', async () => {
		const req = {
			params: { slug: 'home' },
			body: { order: [] },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageSectionReorderController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
