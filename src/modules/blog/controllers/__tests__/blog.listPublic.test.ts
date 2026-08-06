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
vi.mock('@Modules/blog/application/listBlogPublic', () => ({
	listBlogPublic: vi.fn(),
}));

import { blogListPublicController } from '@Modules/blog/controllers/blog.listPublic';
import { listBlogPublic } from '@Modules/blog/application/listBlogPublic';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('blogListPublicController', () => {
	it('returns public blog list with meta', async () => {
		vi.mocked(listBlogPublic).mockResolvedValue({
			data: [{ id: '1', slug: 'post' }],
			meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
		} as never);
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		await blogListPublicController(req, res, vi.fn());
		expect(listBlogPublic).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when application throws', async () => {
		vi.mocked(listBlogPublic).mockRejectedValue(new Error('db down'));
		const req = { query: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		blogListPublicController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
