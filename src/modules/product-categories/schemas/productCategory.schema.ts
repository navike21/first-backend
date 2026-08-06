import { z } from 'zod';
import { LocalizedStringSchema } from '@Shared/schemas/localizedString.schema';
import { localizedSlugSchema } from '@Shared/schemas/localizedSlug.schema';

export const CreateProductCategorySchema = z.object({
	name: LocalizedStringSchema,
	// Per-language slug — each language can have its own URL-friendly identifier
	slug: localizedSlugSchema('PRODUCT_CATEGORY_SLUG_INVALID', 150).optional(),
	parentId: z
		.uuid({ message: 'PRODUCT_CATEGORY_PARENT_ID_INVALID' })
		.optional(),
	order: z.coerce.number().int().default(0),
	isActive: z.boolean().default(true),
});

export const UpdateProductCategorySchema = z
	.object({
		name: LocalizedStringSchema,
		slug: localizedSlugSchema('PRODUCT_CATEGORY_SLUG_INVALID', 150),
		parentId: z
			.uuid({ message: 'PRODUCT_CATEGORY_PARENT_ID_INVALID' })
			.nullable(),
		order: z.coerce.number().int(),
		isActive: z.boolean(),
	})
	.partial();

export const ListProductCategoriesQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	search: z.string().trim().max(200).optional(),
	isActive: z.coerce.boolean().optional(),
	parentId: z.uuid().optional(),
});

export type CreateProductCategoryInput = z.infer<
	typeof CreateProductCategorySchema
>;
export type UpdateProductCategoryInput = z.infer<
	typeof UpdateProductCategorySchema
>;
