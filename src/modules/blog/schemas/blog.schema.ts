import { z } from 'zod';
import {
	LocalizedStringSchema,
	LocalizedHtmlStringSchema,
} from '@Shared/schemas/localizedString.schema';
import { localizedSlugSchema } from '@Shared/schemas/localizedSlug.schema';
import { BLOG_STATUSES_ARRAY } from '../constants/blogStatus';

const BlogSeoSchema = z.object({
	metaTitle: LocalizedStringSchema.optional(),
	metaDescription: LocalizedStringSchema.optional(),
	keywords: LocalizedStringSchema.optional(),
	// Empty string clears a previously stored image (mirrors coverImageUrl '').
	ogImage: z
		.url({ message: 'BLOG_SEO_OG_IMAGE_INVALID' })
		.optional()
		.or(z.literal('')),
});

export const CreateBlogSchema = z
	.object({
		// Per-language slug — each language can have its own URL-friendly identifier
		slug: localizedSlugSchema('BLOG_SLUG_INVALID', 200).optional(),

		title: LocalizedStringSchema,
		excerpt: LocalizedStringSchema.optional(),
		content: LocalizedHtmlStringSchema,

		// Optional at the schema level so a multipart create can supply it via an
		// uploaded `cover` file. createBlogPost enforces that a cover (file or URL)
		// is effectively present.
		coverImageUrl: z
			.url({ message: 'BLOG_COVER_IMAGE_URL_INVALID' })
			.optional(),

		categoryIds: z
			.array(z.uuid({ message: 'BLOG_CATEGORY_ID_INVALID' }))
			.default([]),
		tagIds: z.array(z.uuid({ message: 'BLOG_TAG_ID_INVALID' })).default([]),
		authorId: z.uuid({ message: 'BLOG_AUTHOR_ID_INVALID' }).optional(),

		seo: BlogSeoSchema.optional(),

		status: z.enum(BLOG_STATUSES_ARRAY).default('draft'),
		scheduledAt: z.iso
			.datetime({ message: 'BLOG_SCHEDULED_AT_INVALID' })
			.optional(),
	})
	.refine((data) => data.status !== 'scheduled' || !!data.scheduledAt, {
		message: 'BLOG_SCHEDULED_AT_REQUIRED',
		path: ['scheduledAt'],
	});

export const UpdateBlogSchema = z
	.object({
		slug: localizedSlugSchema('BLOG_SLUG_INVALID', 200).optional(),
		title: LocalizedStringSchema,
		excerpt: LocalizedStringSchema.optional(),
		content: LocalizedHtmlStringSchema,
		coverImageUrl: z
			.url({ message: 'BLOG_COVER_IMAGE_URL_INVALID' })
			.optional(),
		categoryIds: z.array(z.uuid({ message: 'BLOG_CATEGORY_ID_INVALID' })),
		tagIds: z.array(z.uuid({ message: 'BLOG_TAG_ID_INVALID' })),
		authorId: z
			.uuid({ message: 'BLOG_AUTHOR_ID_INVALID' })
			.nullable()
			.optional(),
		seo: BlogSeoSchema.optional(),
		status: z.enum(BLOG_STATUSES_ARRAY),
		scheduledAt: z.iso
			.datetime({ message: 'BLOG_SCHEDULED_AT_INVALID' })
			.optional(),
	})
	.partial()
	.refine((data) => data.status !== 'scheduled' || !!data.scheduledAt, {
		message: 'BLOG_SCHEDULED_AT_REQUIRED',
		path: ['scheduledAt'],
	});

export const ListBlogQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	categoryId: z.uuid().optional(),
	tagId: z.uuid().optional(),
});

export const ListBlogAdminQuerySchema = ListBlogQuerySchema.extend({
	status: z.enum(BLOG_STATUSES_ARRAY).optional(),
});

export const ListBlogTrashQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
export type ListBlogQuery = z.infer<typeof ListBlogQuerySchema>;
export type ListBlogAdminQuery = z.infer<typeof ListBlogAdminQuerySchema>;
export type ListBlogTrashQuery = z.infer<typeof ListBlogTrashQuerySchema>;
