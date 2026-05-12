import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';
import { SECTION_TYPES } from '../constants/sectionTypes';

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
	content: z.record(z.unknown()).default({}),
});

export const UpdateSectionSchema = CreateSectionSchema.omit({
	type: true,
}).partial();

export const ReorderSectionsSchema = z.object({
	order: z.array(z.string()).min(1),
});

export const CreatePageSchema = z.object({
	slug: z
		.string()
		.min(1)
		.max(200)
		.trim()
		.regex(/^[a-z0-9-]+$/, { message: 'PAGE_SLUG_INVALID' }),
	title: LocalizedStringSchema,
	description: LocalizedStringSchema.optional(),
	isPublished: z.boolean().default(false),
});

export const UpdatePageSchema = CreatePageSchema.partial();

export const ListPagesQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreatePageInput = z.infer<typeof CreatePageSchema>;
export type UpdatePageInput = z.infer<typeof UpdatePageSchema>;
export type CreateSectionInput = z.infer<typeof CreateSectionSchema>;
export type UpdateSectionInput = z.infer<typeof UpdateSectionSchema>;
export type ReorderSectionsInput = z.infer<typeof ReorderSectionsSchema>;
