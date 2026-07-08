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
vi.mock('@Modules/pages/application/getPageById', () => ({
	getPageById: vi.fn(),
}));

import { pageGetByIdController } from '@Modules/pages/controllers/page.getById';
import { getPageById } from '@Modules/pages/application/getPageById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageGetByIdController', () => {
	it('calls getPageById and returns 200', async () => {
		vi.mocked(getPageById).mockResolvedValue({ id: '1' } as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageGetByIdController(req, res, next);

		expect(getPageById).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});
});
