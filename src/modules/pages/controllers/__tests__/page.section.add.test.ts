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
vi.mock('@Modules/pages/application/addSection', () => ({
	addSection: vi.fn(),
}));

import { pageSectionAddController } from '@Modules/pages/controllers/page.section.add';
import { addSection } from '@Modules/pages/application/addSection';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageSectionAddController', () => {
	it('calls addSection and returns 201 on valid input', async () => {
		vi.mocked(addSection).mockResolvedValue({ id: '1' } as never);
		const req = {
			params: { slug: 'home' },
			body: { type: 'hero' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageSectionAddController(req, res, next);

		expect(addSection).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = {
			params: { slug: 'home' },
			body: { type: 'invalid-type' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageSectionAddController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
