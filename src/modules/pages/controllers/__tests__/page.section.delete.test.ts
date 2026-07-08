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
vi.mock('@Modules/pages/application/deleteSection', () => ({
	deleteSection: vi.fn(),
}));

import { pageSectionDeleteController } from '@Modules/pages/controllers/page.section.delete';
import { deleteSection } from '@Modules/pages/application/deleteSection';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageSectionDeleteController', () => {
	it('calls deleteSection and returns 200', async () => {
		vi.mocked(deleteSection).mockResolvedValue({ id: '1' } as never);
		const req = {
			params: { id: '1', sectionId: 'sec-1' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageSectionDeleteController(req, res, next);

		expect(deleteSection).toHaveBeenCalledWith('1', 'sec-1');
		expect(successResponse).toHaveBeenCalled();
	});
});
