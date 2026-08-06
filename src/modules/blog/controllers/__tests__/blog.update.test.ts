import { describe, it, expect, vi } from 'vitest';
import type { Request } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/blog/application/updateBlogPost', () => ({
	updateBlogPost: vi.fn(),
}));

import { blogUpdateController } from '@Modules/blog/controllers/blog.update';
import { updateBlogPost } from '@Modules/blog/application/updateBlogPost';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

describe('blogUpdateController', () => {
	it('calls updateBlogPost and returns 200', async () => {
		vi.mocked(updateBlogPost).mockResolvedValue({
			data: { id: '1', status: 'published' },
			warnings: [],
		} as never);
		const req = {
			params: { id: '1' },
			body: { status: 'published' },
		} as unknown as Request;
		const res = makeRes();
		await blogUpdateController(req, res, vi.fn());
		expect(updateBlogPost).toHaveBeenCalledWith(
			'1',
			expect.objectContaining({ status: 'published' }),
			expect.any(Object),
			undefined,
		);
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = {
			params: { id: '1' },
			body: { status: 'scheduled' },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await blogUpdateController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
