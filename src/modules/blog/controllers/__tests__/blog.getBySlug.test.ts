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
vi.mock('@Modules/blog/application/getBlogPostBySlug', () => ({
	getBlogPostBySlug: vi.fn(),
}));

import { blogGetBySlugController } from '@Modules/blog/controllers/blog.getBySlug';
import { getBlogPostBySlug } from '@Modules/blog/application/getBlogPostBySlug';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('blogGetBySlugController', () => {
	it('returns post by slug', async () => {
		vi.mocked(getBlogPostBySlug).mockResolvedValue({
			id: '1',
			slug: 'post',
		} as never);
		const req = { params: { slug: 'post' } } as unknown as Request;
		const res = makeRes();
		await blogGetBySlugController(req, res, vi.fn());
		expect(getBlogPostBySlug).toHaveBeenCalledWith('post');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when not found', async () => {
		vi.mocked(getBlogPostBySlug).mockRejectedValue(new Error('not found'));
		const req = { params: { slug: 'missing' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		blogGetBySlugController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
