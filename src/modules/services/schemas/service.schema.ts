import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';
import { PILLARS_ARRAY } from '../constants/pillars';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CreateServiceSchema = z.object({
	slug: z
		.string()
		.regex(slugRegex, { message: 'SERVICE_SLUG_INVALID' })
		.max(100)
		.optional(),

	name: LocalizedStringSchema,
	shortDescription: LocalizedStringSchema,
	description: LocalizedStringSchema,

	icon: z.string().max(2000).trim().optional(),
	coverImageUrl: z
		.url({ message: 'SERVICE_COVER_IMAGE_URL_INVALID' })
		.optional(),

	pillars: z.array(z.enum(PILLARS_ARRAY)).default([]),
	highlights: z.array(LocalizedStringSchema).default([]),
	tags: z.array(z.string().max(50)).default([]),

	order: z.coerce.number().int().default(0),
	isActive: z.boolean().default(true),
});

export const UpdateServiceSchema = CreateServiceSchema.partial();

export const ListServicesQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>;
export type ListServicesQuery = z.infer<typeof ListServicesQuerySchema>;
