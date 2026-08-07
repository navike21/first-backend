import { z } from 'zod';
import {
	LocalizedStringSchema,
	LocalizedHtmlStringSchema,
} from '@Shared/schemas/localizedString.schema';
import { localizedSlugSchema } from '@Shared/schemas/localizedSlug.schema';
import { MoneySchema } from '@Shared/schemas/money.schema';
import { PRODUCT_STATUSES_ARRAY } from '../constants/productStatus';
import { PRODUCT_GALLERY_MAX_ITEMS } from '../constants/paths';

const ProductSeoSchema = z.object({
	metaTitle: LocalizedStringSchema.optional(),
	metaDescription: LocalizedStringSchema.optional(),
	keywords: LocalizedStringSchema.optional(),
	ogImage: z
		.url({ message: 'PRODUCT_SEO_OG_IMAGE_INVALID' })
		.optional()
		.or(z.literal('')),
});

const VariantOptionSchema = z.object({
	name: LocalizedStringSchema,
	values: z
		.array(z.string().trim().min(1).max(50))
		.min(1, { message: 'PRODUCT_VARIANT_OPTION_VALUES_REQUIRED' }),
});

// `id` is preserved across updates so `inventory.Stock` rows (keyed by
// productId+variantId) never orphan when a product is edited — a brand new
// variant simply omits it, and the application layer assigns one. This is
// deliberately NOT the same "always regenerate" pattern as e.g. a customer's
// address list, because variant identity is a real foreign key elsewhere.
const VariantSchema = z.object({
	id: z.uuid({ message: 'PRODUCT_VARIANT_ID_INVALID' }).optional(),
	sku: z.string().trim().max(100).optional().or(z.literal('')),
	optionValues: z.record(z.string(), z.string()),
	price: MoneySchema,
	compareAtPrice: MoneySchema.optional(),
	imageUrl: z.url({ message: 'PRODUCT_VARIANT_IMAGE_URL_INVALID' }).optional(),
});

const productObject = z.object({
	// Per-language slug — each language can have its own URL-friendly identifier
	slug: localizedSlugSchema('PRODUCT_SLUG_INVALID', 200).optional(),

	name: LocalizedStringSchema,
	shortDescription: LocalizedStringSchema.optional(),
	description: LocalizedHtmlStringSchema.optional(),

	sku: z.string().trim().max(100).optional().or(z.literal('')),
	price: MoneySchema,
	compareAtPrice: MoneySchema.optional(),

	categoryIds: z
		.array(z.uuid({ message: 'PRODUCT_CATEGORY_ID_INVALID' }))
		.default([]),
	tagIds: z.array(z.uuid({ message: 'PRODUCT_TAG_ID_INVALID' })).default([]),

	gallery: z
		.array(z.url({ message: 'PRODUCT_GALLERY_URL_INVALID' }))
		.max(PRODUCT_GALLERY_MAX_ITEMS)
		.default([]),

	status: z.enum(PRODUCT_STATUSES_ARRAY).default('draft'),

	seo: ProductSeoSchema.optional(),

	hasVariants: z.boolean().default(false),
	variantOptions: z.array(VariantOptionSchema).default([]),
	variants: z.array(VariantSchema).default([]),
});

export const CreateProductSchema = productObject.refine(
	(data) => !data.hasVariants || data.variants.length > 0,
	{ message: 'PRODUCT_VARIANTS_REQUIRED', path: ['variants'] },
);

// Input-only: reconciles the gallery when present, same semantics as portfolio's
// `galleryOrder` (existing URLs to keep + newly uploaded files, interleaved in
// final order). Omitting it entirely leaves the existing gallery untouched.
export const GalleryOrderTokenSchema = z.union([
	z.object({
		type: z.literal('existing'),
		url: z.url({ message: 'PRODUCT_GALLERY_URL_INVALID' }),
	}),
	z.object({
		type: z.literal('new'),
		index: z.number().int().min(0),
	}),
]);

export const UpdateProductSchema = productObject
	.partial()
	.extend({
		galleryOrder: z
			.array(GalleryOrderTokenSchema)
			.max(PRODUCT_GALLERY_MAX_ITEMS)
			.optional(),
	})
	.refine((data) => !data.hasVariants || (data.variants?.length ?? 0) > 0, {
		message: 'PRODUCT_VARIANTS_REQUIRED',
		path: ['variants'],
	});

export const ListProductsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	search: z.string().trim().max(200).optional(),
	categoryId: z.uuid().optional(),
	tagId: z.uuid().optional(),
});

export const ListProductsAdminQuerySchema = ListProductsQuerySchema.extend({
	status: z.enum(PRODUCT_STATUSES_ARRAY).optional(),
});

export const ListProductsTrashQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type GalleryOrderToken = z.infer<typeof GalleryOrderTokenSchema>;
export type VariantInput = z.infer<typeof VariantSchema>;
export type ListProductsQuery = z.infer<typeof ListProductsQuerySchema>;
export type ListProductsAdminQuery = z.infer<
	typeof ListProductsAdminQuerySchema
>;
export type ListProductsTrashQuery = z.infer<
	typeof ListProductsTrashQuerySchema
>;
