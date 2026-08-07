import { model, Schema } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { moneyType } from '@Shared/infrastructure/moneyType';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import { PRODUCT_STATUSES_ARRAY } from '../constants/productStatus';
import type { LocalizedString } from '@Shared/types/localizedString';
import type { MoneyDocument } from '@Shared/infrastructure/moneyType';

export interface ProductSeo {
	metaTitle?: LocalizedString;
	metaDescription?: LocalizedString;
	keywords?: LocalizedString;
	ogImage?: string;
}

export interface ProductVariantOption {
	name: LocalizedString;
	values: string[];
}

export interface ProductVariant {
	id: string;
	sku?: string;
	optionValues: Record<string, string>;
	price: MoneyDocument;
	compareAtPrice?: MoneyDocument;
	imageUrl?: string;
}

export interface ProductDocument {
	id: string;
	slug: LocalizedString;
	name: LocalizedString;
	shortDescription?: LocalizedString;
	description?: LocalizedString;
	sku?: string;
	price: MoneyDocument;
	compareAtPrice?: MoneyDocument;
	categoryIds: string[];
	tagIds: string[];
	gallery: string[];
	status: string;
	seo: ProductSeo;
	hasVariants: boolean;
	variantOptions: ProductVariantOption[];
	variants: ProductVariant[];
	deletedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const ProductSeoSchema = new Schema(
	{
		metaTitle: { type: localizedStringType },
		metaDescription: { type: localizedStringType },
		keywords: { type: localizedStringType },
		ogImage: { type: String },
	},
	{ _id: false },
);

const ProductVariantOptionSchema = new Schema(
	{
		name: { type: localizedStringType, required: true },
		values: [{ type: String }],
	},
	{ _id: false },
);

// `id` defaults via generateUUID on subdocument creation but is deliberately
// NOT regenerated on every save — the application layer preserves whatever
// `id` the client sent for an existing variant (see product.schema.ts), since
// `inventory.Stock` rows reference a variant by this id.
const ProductVariantSchema = new Schema(
	{
		id: { type: String, required: true, default: generateUUID },
		sku: { type: String, maxLength: 100 },
		optionValues: { type: Schema.Types.Mixed, default: {} },
		price: { type: moneyType, required: true },
		compareAtPrice: { type: moneyType },
		imageUrl: { type: String },
	},
	{ _id: false },
);

const productSchema = new Schema<ProductDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		slug: { type: localizedStringType },
		name: { type: localizedStringType, required: true },
		shortDescription: { type: localizedStringType },
		description: { type: localizedStringType },
		sku: { type: String, maxLength: 100 },
		price: { type: moneyType, required: true },
		compareAtPrice: { type: moneyType },
		categoryIds: [{ type: String }],
		tagIds: [{ type: String }],
		gallery: [{ type: String }],
		status: {
			type: String,
			required: true,
			default: 'draft',
			enum: PRODUCT_STATUSES_ARRAY,
		},
		seo: { type: ProductSeoSchema, default: () => ({}) },
		hasVariants: { type: Boolean, default: false },
		variantOptions: [ProductVariantOptionSchema],
		variants: [ProductVariantSchema],
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

// Slugs are unique per language, not globally — a partial unique index per
// language (mirroring Portfolio/Blog's pattern). Scoped to non-deleted
// records: a trashed product frees its slug for reuse.
for (const lang of SUPPORTED_LANGUAGES) {
	productSchema.index(
		{ [`slug.${lang}`]: 1 },
		{
			unique: true,
			partialFilterExpression: {
				[`slug.${lang}`]: { $type: 'string', $ne: '' },
				deletedAt: null,
			},
		},
	);
}
// Same partial-unique precedent for `sku` — a top-level SKU only applies to
// simple (non-variant) products, so blank/absent SKUs (variant products)
// never collide with each other.
productSchema.index(
	{ sku: 1 },
	{
		unique: true,
		partialFilterExpression: {
			sku: { $type: 'string', $ne: '' },
			deletedAt: null,
		},
	},
);
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ categoryIds: 1, status: 1 });
productSchema.index({ tagIds: 1, status: 1 });

export default model<ProductDocument>('Product', productSchema);
