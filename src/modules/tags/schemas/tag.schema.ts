import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CreateTagSchema = z.object({
	name: LocalizedStringSchema,
	slug: z
		.string()
		.trim()
		.min(1)
		.max(150)
		.regex(slugRegex, { message: 'TAG_SLUG_INVALID' }),
	order: z.coerce.number().int().default(0),
	isActive: z.boolean().default(true),
});

export const UpdateTagSchema = CreateTagSchema.partial();

export const ListTagsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	search: z.string().trim().max(200).optional(),
	isActive: z.coerce.boolean().optional(),
});

export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;
