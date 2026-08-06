import { model, Schema } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { localizedStringType } from '@Shared/infrastructure/localizedStringType';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import { BLOG_STATUSES_ARRAY } from '../constants/blogStatus';
import type { LocalizedString } from '@Shared/types/localizedString';

export interface BlogSeo {
	metaTitle?: LocalizedString;
	metaDescription?: LocalizedString;
	keywords?: LocalizedString;
	ogImage?: string;
}

export interface BlogDocument {
	id: string;
	slug: LocalizedString;
	title: LocalizedString;
	excerpt: LocalizedString;
	content: LocalizedString;
	coverImageUrl: string;
	categoryIds: string[];
	tagIds: string[];
	authorId?: string;
	seo: BlogSeo;
	status: string;
	scheduledAt?: Date;
	deletedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const BlogSeoSchema = new Schema(
	{
		metaTitle: { type: localizedStringType },
		metaDescription: { type: localizedStringType },
		keywords: { type: localizedStringType },
		ogImage: { type: String },
	},
	{ _id: false },
);

const blogSchema = new Schema<BlogDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		slug: { type: localizedStringType },
		title: { type: localizedStringType, required: true },
		excerpt: { type: localizedStringType },
		content: { type: localizedStringType, required: true },
		coverImageUrl: { type: String, required: true },
		categoryIds: { type: [String], default: [] },
		tagIds: { type: [String], default: [] },
		authorId: { type: String },
		seo: { type: BlogSeoSchema, default: () => ({}) },
		status: {
			type: String,
			required: true,
			default: 'draft',
			enum: BLOG_STATUSES_ARRAY,
		},
		scheduledAt: { type: Date },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

// Slugs are unique per language, not globally — same partial-unique-index
// pattern as Portfolio/Pages. Scoped to non-deleted records: a trashed post
// frees its slug for reuse.
for (const lang of SUPPORTED_LANGUAGES) {
	blogSchema.index(
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
blogSchema.index({ status: 1, scheduledAt: 1 });
blogSchema.index({ categoryIds: 1 });
blogSchema.index({ tagIds: 1 });
blogSchema.index({ authorId: 1 });

export default model<BlogDocument>('Blog', blogSchema);
