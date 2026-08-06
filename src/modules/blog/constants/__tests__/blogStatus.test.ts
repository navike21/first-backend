import { describe, it, expect } from 'vitest';
import {
	BLOG_STATUSES,
	BLOG_STATUSES_ARRAY,
} from '@Modules/blog/constants/blogStatus';

describe('blogStatus constants', () => {
	it('BLOG_STATUSES contains all statuses', () => {
		// Lifecycle statuses only; deletion is tracked separately via deletedAt.
		expect(BLOG_STATUSES).toContain('draft');
		expect(BLOG_STATUSES).toContain('scheduled');
		expect(BLOG_STATUSES).toContain('published');
	});

	it('BLOG_STATUSES_ARRAY matches BLOG_STATUSES', () => {
		expect(BLOG_STATUSES_ARRAY).toEqual([...BLOG_STATUSES]);
	});
});
