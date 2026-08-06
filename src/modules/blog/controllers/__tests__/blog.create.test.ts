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
vi.mock('@Modules/blog/application/createBlogPost', () => ({
	createBlogPost: vi.fn(),
}));

import { blogCreateController } from '@Modules/blog/controllers/blog.create';
import { createBlogPost } from '@Modules/blog/application/createBlogPost';
import { successResponse } from '@Helpers/responseStructure';
import { makeRes } from './testHelpers';

const ls = {
	en: 'a',
	es: 'b',
	de: 'c',
	fr: 'd',
	it: 'e',
	ja: 'f',
	ko: 'g',
	pt: 'h',
	ru: 'i',
	zh: 'j',
};
const validBody = {
	title: ls,
	content: ls,
	coverImageUrl: 'https://example.com/img.jpg',
};

describe('blogCreateController', () => {
	it('calls createBlogPost and returns 201', async () => {
		vi.mocked(createBlogPost).mockResolvedValue({
			data: { id: '1', slug: 'post' },
			warnings: [],
		} as never);
		const req = { body: validBody } as unknown as Request;
		const res = makeRes();
		await blogCreateController(req, res, vi.fn());
		expect(createBlogPost).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await blogCreateController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
