import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import { SECTION_TYPES } from '../constants/sectionTypes';
import { PAGE_STATUSES } from '../schemas/page.schema';

// Superset plano de imagen+video (Mongoose no tiene discriminated unions
// nativas) — Zod (page.schema.ts) es el límite estricto de validación; este
// schema solo debe evitar descartar en silencio campos que Zod ya validó.
const BackgroundConfigSchema = new Schema(
	{
		type: { type: String, enum: ['none', 'image', 'video'] },
		// imagen
		url: { type: String },
		position: { type: String, enum: ['top', 'center', 'bottom'] },
		fullScreen: { type: Boolean },
		// video
		sourceKind: { type: String, enum: ['upload', 'embed'] },
		files: {
			type: [
				new Schema(
					{ url: { type: String }, mimeType: { type: String } },
					{ _id: false },
				),
			],
		},
		embedUrl: { type: String },
		// compartido imagen+video
		parallax: { type: Boolean },
	},
	{ _id: false },
);

const SectionBackgroundSchema = new Schema(
	{
		desktop: { type: BackgroundConfigSchema },
		tablet: { type: BackgroundConfigSchema },
		mobile: { type: BackgroundConfigSchema },
	},
	{ _id: false },
);

const SectionSettingsSchema = new Schema(
	{
		columns: { type: Number },
		tabletColumns: { type: Number },
		mobileColumns: { type: Number },
		hiddenOnTablet: { type: Boolean },
		hiddenOnMobile: { type: Boolean },
		background: { type: SectionBackgroundSchema },
		paddingTop: { type: String },
		paddingBottom: { type: String },
		fullWidth: { type: Boolean },
		customClass: { type: String },
	},
	{ _id: false },
);

const SectionSchema = new Schema(
	{
		sectionId: { type: String, default: generateUUID },
		type: { type: String, enum: SECTION_TYPES, required: true },
		order: { type: Number, default: 0 },
		settings: { type: SectionSettingsSchema },
		content: { type: Schema.Types.Mixed, default: {} },
	},
	{ _id: false },
);

const PageSeoSchema = new Schema(
	{
		metaTitle: { type: localizedStringType },
		metaDescription: { type: localizedStringType },
		keywords: { type: localizedStringType },
		ogImage: { type: String },
	},
	{ _id: false },
);

const PageSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		slug: { type: localizedStringType },
		fullPath: { type: localizedStringType },
		title: localizedStringType,
		description: localizedStringType,
		coverImageUrl: { type: String },
		seo: { type: PageSeoSchema, default: () => ({}) },
		parentId: { type: String, default: null },
		sections: { type: [SectionSchema], default: [] },
		status: {
			type: String,
			enum: PAGE_STATUSES,
			default: 'draft',
		},
		scheduledAt: { type: Date },
		categoryIds: { type: [String], default: [] },
		tagIds: { type: [String], default: [] },
		createdBy: { type: String },
		updatedBy: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

PageSchema.index({ status: 1 });
PageSchema.index({ parentId: 1 });

// Slugs are unique per language among siblings (same parentId), not globally —
// a partial unique index per language keeps the DB (not app-level checks) as
// the source of truth for the constraint, matching the project's convention
// that Mongo's E11000 is what backs a 409 RESOURCE_DUPLICATE.
for (const lang of SUPPORTED_LANGUAGES) {
	PageSchema.index(
		{ [`slug.${lang}`]: 1, parentId: 1 },
		{
			unique: true,
			partialFilterExpression: {
				[`slug.${lang}`]: { $type: 'string', $ne: '' },
				deletedAt: null,
			},
		},
	);
}

const PageModel = model('Page', PageSchema);
export default PageModel;
