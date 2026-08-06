import { describe, it, expect } from 'vitest';
import {
	BLOG_PATH_LIST_PUBLIC,
	BLOG_PATH_LIST_ADMIN,
	BLOG_PATH_GET_BY_SLUG,
	BLOG_PATH_CREATE,
	BLOG_PATH_UPDATE,
	BLOG_PATH_DELETE,
} from '@Modules/blog/constants/paths';

describe('blog paths constants', () => {
	it('exports expected path strings', () => {
		expect(BLOG_PATH_LIST_PUBLIC).toBe('/blog');
		expect(BLOG_PATH_LIST_ADMIN).toBe('/blog/admin');
		expect(BLOG_PATH_GET_BY_SLUG).toBe('/blog/:slug');
		expect(BLOG_PATH_CREATE).toBe('/blog');
		expect(BLOG_PATH_UPDATE).toBe('/blog/:id');
		expect(BLOG_PATH_DELETE).toBe('/blog/:id');
	});
});
