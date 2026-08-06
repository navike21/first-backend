import { describe, it, expect } from 'vitest';
import {
	CreateBlogSchema,
	UpdateBlogSchema,
	ListBlogQuerySchema,
	ListBlogAdminQuerySchema,
} from '@Modules/blog/schemas/blog.schema';

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

const validBlog = {
	title: ls,
	content: ls,
	coverImageUrl: 'https://example.com/cover.jpg',
};

describe('blog.schema', () => {
	it('CreateBlogSchema parses valid minimal data', () => {
		const result = CreateBlogSchema.safeParse(validBlog);
		expect(result.success).toBe(true);
	});

	it('CreateBlogSchema allows missing coverImageUrl (supplied by file upload)', () => {
		const { coverImageUrl: _, ...rest } = validBlog;
		const result = CreateBlogSchema.safeParse(rest);
		// The cover requirement is enforced by createBlogPost, not the schema,
		// so a multipart create can supply it via an uploaded `cover` file.
		expect(result.success).toBe(true);
	});

	it('CreateBlogSchema rejects invalid slug format', () => {
		const result = CreateBlogSchema.safeParse({
			...validBlog,
			slug: { en: 'Invalid Slug!' },
		});
		expect(result.success).toBe(false);
	});

	it('CreateBlogSchema accepts a valid per-language slug', () => {
		const result = CreateBlogSchema.safeParse({
			...validBlog,
			slug: { en: 'my-post', es: 'mi-entrada' },
		});
		expect(result.success).toBe(true);
	});

	it('CreateBlogSchema accepts categoryIds/tagIds/authorId', () => {
		const result = CreateBlogSchema.safeParse({
			...validBlog,
			categoryIds: ['550e8400-e29b-41d4-a716-446655440000'],
			tagIds: ['550e8400-e29b-41d4-a716-446655440001'],
			authorId: '550e8400-e29b-41d4-a716-446655440002',
		});
		expect(result.success).toBe(true);
	});

	it('CreateBlogSchema rejects non-uuid categoryIds', () => {
		const result = CreateBlogSchema.safeParse({
			...validBlog,
			categoryIds: ['not-a-uuid'],
		});
		expect(result.success).toBe(false);
	});

	it('CreateBlogSchema accepts seo block', () => {
		const result = CreateBlogSchema.safeParse({
			...validBlog,
			seo: { metaTitle: ls, metaDescription: ls, ogImage: 'https://example.com/og.jpg' },
		});
		expect(result.success).toBe(true);
	});

	it('CreateBlogSchema requires scheduledAt when status is scheduled', () => {
		const result = CreateBlogSchema.safeParse({
			...validBlog,
			status: 'scheduled',
		});
		expect(result.success).toBe(false);
	});

	it('CreateBlogSchema accepts a scheduled post with scheduledAt', () => {
		const result = CreateBlogSchema.safeParse({
			...validBlog,
			status: 'scheduled',
			scheduledAt: new Date().toISOString(),
		});
		expect(result.success).toBe(true);
	});

	it('UpdateBlogSchema allows empty object', () => {
		const result = UpdateBlogSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('ListBlogQuerySchema defaults page and limit', () => {
		const result = ListBlogQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});

	it('ListBlogAdminQuerySchema accepts status filter', () => {
		const result = ListBlogAdminQuerySchema.safeParse({
			status: 'published',
		});
		expect(result.success).toBe(true);
	});

	it('ListBlogAdminQuerySchema rejects invalid status', () => {
		const result = ListBlogAdminQuerySchema.safeParse({
			status: 'invalid-status',
		});
		expect(result.success).toBe(false);
	});
});
