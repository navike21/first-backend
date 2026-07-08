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
vi.mock('@Modules/pages/application/resolvePageByPath', () => ({
	resolvePageByPath: vi.fn(),
}));

import { pageResolvePublicController } from '@Modules/pages/controllers/page.resolve';
import { resolvePageByPath } from '@Modules/pages/application/resolvePageByPath';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('pageResolvePublicController', () => {
	it('calls resolvePageByPath and returns 200', async () => {
		vi.mocked(resolvePageByPath).mockResolvedValue({
			id: '1',
			fullPath: { en: 'home' },
		} as never);
		const req = { query: { path: 'home', lang: 'en' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await pageResolvePublicController(req, res, next);

		expect(resolvePageByPath).toHaveBeenCalledWith('home', 'en');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when page not found', async () => {
		vi.mocked(resolvePageByPath).mockRejectedValue(new Error('not found'));
		const req = { query: { path: 'bad', lang: 'en' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		pageResolvePublicController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
