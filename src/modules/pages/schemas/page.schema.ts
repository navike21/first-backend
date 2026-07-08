import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import { SECTION_TYPES } from '../constants/sectionTypes';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const LocalizedSlugSchema = z.object(
	Object.fromEntries(
		SUPPORTED_LANGUAGES.map((l) => [
			l,
			z
				.string()
				.trim()
				.max(200)
				.regex(slugRegex, { message: 'PAGE_SLUG_INVALID' })
				.or(z.literal(''))
				.optional(),
		]),
	),
);

const PageSeoSchema = z.object({
	metaTitle: LocalizedStringSchema.optional(),
	metaDescription: LocalizedStringSchema.optional(),
	keywords: LocalizedStringSchema.optional(),
	// Empty string clears a previously stored image (mirrors coverImageUrl '').
	ogImage: z.url({ message: 'PAGE_SEO_OG_IMAGE_INVALID' }).optional().or(z.literal('')),
});

export const SectionSettingsSchema = z
	.object({
		columns: z.number().int().min(1).max(12).optional(),
		background: z.string().optional(),
		paddingTop: z.string().optional(),
		paddingBottom: z.string().optional(),
		fullWidth: z.boolean().optional(),
		customClass: z.string().optional(),
	})
	.optional();

export const CreateSectionSchema = z.object({
	type: z.enum(SECTION_TYPES),
	order: z.coerce.number().int().default(0),
	settings: SectionSettingsSchema,
	content: z.record(z.string(), z.unknown()).default({}),
});

export const UpdateSectionSchema = CreateSectionSchema.omit({
	type: true,
}).partial();

export const ReorderSectionsSchema = z.object({
	order: z.array(z.string()).min(1),
});

export const PAGE_STATUSES = ['draft', 'scheduled', 'published'] as const;

export const CreatePageSchema = z
	.object({
		slug: LocalizedSlugSchema.optional(),
		title: LocalizedStringSchema,
		description: LocalizedStringSchema.optional(),
		coverImageUrl: z.url({ message: 'PAGE_COVER_IMAGE_URL_INVALID' }).optional(),
		seo: PageSeoSchema.optional(),
		parentId: z.uuid({ message: 'PAGE_PARENT_ID_INVALID' }).optional(),
		status: z.enum(PAGE_STATUSES).default('draft'),
		scheduledAt: z.iso.datetime({ message: 'PAGE_SCHEDULED_AT_INVALID' }).optional(),
		categoryIds: z.array(z.uuid({ message: 'PAGE_CATEGORY_ID_INVALID' })).default([]),
		tagIds: z.array(z.uuid({ message: 'PAGE_TAG_ID_INVALID' })).default([]),
	})
	.refine((data) => data.status !== 'scheduled' || !!data.scheduledAt, {
		message: 'PAGE_SCHEDULED_AT_REQUIRED',
		path: ['scheduledAt'],
	});

export const UpdatePageSchema = z
	.object({
		slug: LocalizedSlugSchema.optional(),
		title: LocalizedStringSchema,
		description: LocalizedStringSchema.optional(),
		coverImageUrl: z.url({ message: 'PAGE_COVER_IMAGE_URL_INVALID' }).optional(),
		seo: PageSeoSchema.optional(),
		parentId: z.uuid({ message: 'PAGE_PARENT_ID_INVALID' }).nullable().optional(),
		status: z.enum(PAGE_STATUSES),
		scheduledAt: z.iso.datetime({ message: 'PAGE_SCHEDULED_AT_INVALID' }).optional(),
		categoryIds: z.array(z.uuid({ message: 'PAGE_CATEGORY_ID_INVALID' })),
		tagIds: z.array(z.uuid({ message: 'PAGE_TAG_ID_INVALID' })),
	})
	.partial()
	.refine((data) => data.status !== 'scheduled' || !!data.scheduledAt, {
		message: 'PAGE_SCHEDULED_AT_REQUIRED',
		path: ['scheduledAt'],
	});

export const ListPagesQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	search: z.string().trim().optional(),
	status: z.enum(PAGE_STATUSES).optional(),
	parentId: z.uuid().optional(),
});

export const ResolvePageQuerySchema = z.object({
	path: z.string().trim().min(1),
	lang: z.enum(SUPPORTED_LANGUAGES),
});

export type CreatePageInput = z.infer<typeof CreatePageSchema>;
export type UpdatePageInput = z.infer<typeof UpdatePageSchema>;
export type CreateSectionInput = z.infer<typeof CreateSectionSchema>;
export type UpdateSectionInput = z.infer<typeof UpdateSectionSchema>;
export type ReorderSectionsInput = z.infer<typeof ReorderSectionsSchema>;
