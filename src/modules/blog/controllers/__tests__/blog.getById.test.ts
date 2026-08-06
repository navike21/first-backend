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
vi.mock('@Modules/blog/application/getBlogPostById', () => ({
	getBlogPostById: vi.fn(),
}));

import { blogGetByIdController } from '@Modules/blog/controllers/blog.getById';
import { getBlogPostById } from '@Modules/blog/application/getBlogPostById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('blogGetByIdController', () => {
	it('returns post by id', async () => {
		vi.mocked(getBlogPostById).mockResolvedValue({
			id: '1',
			slug: 'post',
		} as never);
		const req = { params: { id: '1' } } as unknown as Request;
		const res = makeRes();
		await blogGetByIdController(req, res, vi.fn());
		expect(getBlogPostById).toHaveBeenCalledWith('1');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error when not found', async () => {
		vi.mocked(getBlogPostById).mockRejectedValue(new Error('not found'));
		const req = { params: { id: 'missing' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		blogGetByIdController(req, res, next);
		await new Promise((r) => setImmediate(r));
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
