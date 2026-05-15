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
vi.mock('@Modules/pages/application/updateSection', () => ({
	updateSection: vi.fn(),
}));

import { pageSectionUpdateController } from '@Modules/pages/controllers/page.section.update';
import { updateSection } from '@Modules/pages/application/updateSection';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageSectionUpdateController', () => {
	it('calls updateSection and returns 200 on valid input', async () => {
		vi.mocked(updateSection).mockResolvedValue({ id: '1' } as never);
		const req = {
			params: { slug: 'home', sectionId: 'sec-1' },
			body: { content: { headline: 'Hi' } },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageSectionUpdateController(req, res, next);

		expect(updateSection).toHaveBeenCalledWith(
			'home',
			'sec-1',
			expect.any(Object),
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body (bad order value)', async () => {
		const req = {
			params: { slug: 'home', sectionId: 'sec-1' },
			body: { order: 'not-a-number-at-all-xyz' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageSectionUpdateController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('calls next with error when updateSection rejects', async () => {
		vi.mocked(updateSection).mockRejectedValue(new Error('section not found'));
		const req = {
			params: { slug: 'home', sectionId: 'bad-id' },
			body: {},
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		pageSectionUpdateController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
