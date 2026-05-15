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
vi.mock('@Modules/pages/application/listPages', () => ({
	listPages: vi.fn(),
}));

import {
	pageListPublicController,
	pageListAdminController,
} from '@Modules/pages/controllers/page.list';
import { listPages } from '@Modules/pages/application/listPages';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const mockResult = {
	data: [],
	meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

describe('pageListPublicController', () => {
	it('calls listPages with adminView false and returns 200', async () => {
		vi.mocked(listPages).mockResolvedValue(mockResult);
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageListPublicController(req, res, next);

		expect(listPages).toHaveBeenCalledWith(
			expect.objectContaining({ adminView: false }),
		);
		expect(successResponse).toHaveBeenCalled();
	});
});

describe('pageListAdminController', () => {
	it('calls listPages with adminView true and returns 200', async () => {
		vi.mocked(listPages).mockResolvedValue(mockResult);
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageListAdminController(req, res, next);

		expect(listPages).toHaveBeenCalledWith(
			expect.objectContaining({ adminView: true }),
		);
		expect(successResponse).toHaveBeenCalled();
	});
});
