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
vi.mock('@Modules/pages/application/deletePage', () => ({
	deletePage: vi.fn(),
}));

import { pageDeleteController } from '@Modules/pages/controllers/page.delete';
import { deletePage } from '@Modules/pages/application/deletePage';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageDeleteController', () => {
	it('calls deletePage and returns 200', async () => {
		vi.mocked(deletePage).mockResolvedValue({
			id: '1',
			deletedAt: new Date(),
		} as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageDeleteController(req, res, next);

		expect(deletePage).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});
});
