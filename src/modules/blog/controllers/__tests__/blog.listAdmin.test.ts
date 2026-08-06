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
vi.mock('@Modules/blog/application/listBlogAdmin', () => ({
	listBlogAdmin: vi.fn(),
}));

import { blogListAdminController } from '@Modules/blog/controllers/blog.listAdmin';
import { listBlogAdmin } from '@Modules/blog/application/listBlogAdmin';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('blogListAdminController', () => {
	it('returns admin blog list with meta', async () => {
		vi.mocked(listBlogAdmin).mockResolvedValue({
			data: [{ id: '1', slug: 'post' }],
			meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
		} as never);
		const req = { query: { page: '1', limit: '10' } } as unknown as Request;
		const res = makeRes();
		await blogListAdminController(req, res, vi.fn());
		expect(listBlogAdmin).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when application throws', async () => {
		vi.mocked(listBlogAdmin).mockRejectedValue(new Error('db down'));
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		blogListAdminController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('calls next with error on invalid query', async () => {
		const req = { query: { status: 'not-a-status' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await blogListAdminController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
