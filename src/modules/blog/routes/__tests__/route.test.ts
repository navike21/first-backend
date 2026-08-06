import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/blog/application/createBlogPost', () => ({
	createBlogPost: vi.fn(),
}));
vi.mock('@Modules/blog/application/listBlogPublic', () => ({
	listBlogPublic: vi.fn(),
}));
vi.mock('@Modules/blog/application/listBlogAdmin', () => ({
	listBlogAdmin: vi.fn(),
}));
vi.mock('@Modules/blog/application/getBlogPostBySlug', () => ({
	getBlogPostBySlug: vi.fn(),
}));
vi.mock('@Modules/blog/application/updateBlogPost', () => ({
	updateBlogPost: vi.fn(),
}));
vi.mock('@Modules/blog/application/deleteBlogPostLogical', () => ({
	deleteBlogPostLogical: vi.fn(),
}));

import { Router } from 'express';
import { blogApi } from '@Modules/blog/routes/route';

describe('blogApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => blogApi(router)).not.toThrow();
	});
});
