import { z } from 'zod';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';

export const TRANSLATION_DOMAINS = [
	'services',
	'pages',
	'portfolio',
	'collaborators',
	'forms',
	'categories',
	'tags',
	'page-builder',
	'blog',
] as const;

export type TranslationDomain = (typeof TRANSLATION_DOMAINS)[number];

// Every domain except `page-builder` has a fixed, named set of request/
// result fields (name/description/...). A page's translatable content is an
// arbitrary number of section/column/element fields that varies per page —
// its RESULT schema can't be a static constant like the other 7 (see
// `application/suggestTranslation.ts`, which builds it per-request from the
// real field keys instead of pulling from `RESULT_SCHEMA_BY_DOMAIN`).
type FixedShapeDomain = Exclude<TranslationDomain, 'page-builder'>;

// Per-domain request field shapes. Only the "primary" field of each domain
// (the one that gates whether the translate button even shows up on the
// frontend) requires non-empty content — secondary/optional fields (SEO meta,
// a form's success message) are allowed blank, matching their own optionality
// in that domain's real data model.
const ServicesFieldsSchema = z.object({
	name: z.string().trim().min(1).max(200),
	shortDescription: z.string().trim().min(1).max(500),
	// Rich HTML from the editor — sanitized already on save; not re-sanitized
	// here since this text never gets persisted, only echoed back translated.
	description: z.string().trim().min(1).max(20_000),
});

// Same shape as Services today — kept as its own name (not reused directly)
// so each domain's schema can diverge independently later without a
// cross-domain ripple.
const PortfolioFieldsSchema = z.object({
	name: z.string().trim().min(1).max(200),
	shortDescription: z.string().trim().min(1).max(500),
	description: z.string().trim().min(1).max(20_000),
});

const PagesFieldsSchema = z.object({
	title: z.string().trim().min(1).max(200),
	description: z.string().trim().max(500),
	metaTitle: z.string().trim().max(200),
	metaDescription: z.string().trim().max(500),
});

const CollaboratorsFieldsSchema = z.object({
	bio: z.string().trim().min(1).max(20_000),
});

const FormsFieldsSchema = z.object({
	title: z.string().trim().min(1).max(200),
	description: z.string().trim().max(500),
	successMessage: z.string().trim().max(500),
});

// Categories/Tags: a single short field, same shape/reasoning as
// Collaborators' `bio` above — kept as its own name per-domain rather than
// shared, matching the "no cross-domain ripple" convention above.
const CategoriesFieldsSchema = z.object({
	name: z.string().trim().min(1).max(200),
});

const TagsFieldsSchema = z.object({
	name: z.string().trim().min(1).max(200),
});

// Same shape as Pages' primary/secondary split: `title` gates the button,
// `excerpt` is allowed blank (it's optional in the real data model too).
const BlogFieldsSchema = z.object({
	title: z.string().trim().min(1).max(200),
	excerpt: z.string().trim().max(500),
	content: z.string().trim().min(1).max(20_000),
});

// Page Builder: an arbitrary bag of `elementId`-keyed (or
// `elementId:itemId:field`-keyed) values — the frontend flattens a page's
// entire translatable content into this shape (see
// `page.builder.ts::extractTranslatableFields` on the frontend). Capped on
// entry count and total content size so one page can't balloon a single
// call's cost regardless of how large it grows.
const PAGE_BUILDER_MAX_ENTRIES = 150;
const PAGE_BUILDER_MAX_TOTAL_CHARS = 60_000;

const PageBuilderFieldsSchema = z
	.record(z.string().min(1).max(300), z.string().max(20_000))
	.refine((entries) => Object.keys(entries).length > 0, {
		message: 'At least one translatable field is required',
	})
	.refine((entries) => Object.keys(entries).length <= PAGE_BUILDER_MAX_ENTRIES, {
		message: `A single request can translate at most ${PAGE_BUILDER_MAX_ENTRIES} fields`,
	})
	.refine(
		(entries) =>
			Object.values(entries).reduce((sum, value) => sum + value.length, 0) <=
			PAGE_BUILDER_MAX_TOTAL_CHARS,
		{
			message: 'Total translatable content is too large for a single request',
		},
	);

const FIELDS_SCHEMA_BY_DOMAIN = {
	services: ServicesFieldsSchema,
	pages: PagesFieldsSchema,
	portfolio: PortfolioFieldsSchema,
	collaborators: CollaboratorsFieldsSchema,
	forms: FormsFieldsSchema,
	categories: CategoriesFieldsSchema,
	tags: TagsFieldsSchema,
	'page-builder': PageBuilderFieldsSchema,
	blog: BlogFieldsSchema,
} satisfies Record<TranslationDomain, z.ZodTypeAny>;

// Both languages are always dynamic — the source is whatever language the
// editor currently has active in their own UI (never assumed to be Spanish
// or any other fixed language), the target is whichever tab they're filling
// in.
function requestSchemaFor<D extends TranslationDomain>(domain: D) {
	return z.object({
		domain: z.literal(domain),
		sourceLanguage: z.enum(SUPPORTED_LANGUAGES),
		targetLanguage: z.enum(SUPPORTED_LANGUAGES),
		fields: FIELDS_SCHEMA_BY_DOMAIN[domain],
	});
}

export const SuggestTranslationSchema = z
	.discriminatedUnion('domain', [
		requestSchemaFor('services'),
		requestSchemaFor('pages'),
		requestSchemaFor('portfolio'),
		requestSchemaFor('collaborators'),
		requestSchemaFor('forms'),
		requestSchemaFor('categories'),
		requestSchemaFor('tags'),
		requestSchemaFor('page-builder'),
		requestSchemaFor('blog'),
	])
	.refine((data) => data.sourceLanguage !== data.targetLanguage, {
		message: 'TRANSLATION_SOURCE_EQUALS_TARGET',
		path: ['targetLanguage'],
	});

export type SuggestTranslationInput = z.infer<typeof SuggestTranslationSchema>;

// Structured-output schema the model's response must match per domain — same
// keys as the request's `fields`, kept separate (not `.pick()`'d from the
// request schema) since it's an output contract with no `.trim()`/`.min()`
// request-side refinements.
const ServicesTranslationResultSchema = z.object({
	name: z.string(),
	shortDescription: z.string(),
	description: z.string(),
});

const PortfolioTranslationResultSchema = z.object({
	name: z.string(),
	shortDescription: z.string(),
	description: z.string(),
});

const PagesTranslationResultSchema = z.object({
	title: z.string(),
	description: z.string(),
	metaTitle: z.string(),
	metaDescription: z.string(),
});

const CollaboratorsTranslationResultSchema = z.object({
	bio: z.string(),
});

const FormsTranslationResultSchema = z.object({
	title: z.string(),
	description: z.string(),
	successMessage: z.string(),
});

const CategoriesTranslationResultSchema = z.object({
	name: z.string(),
});

const TagsTranslationResultSchema = z.object({
	name: z.string(),
});

const BlogTranslationResultSchema = z.object({
	title: z.string(),
	excerpt: z.string(),
	content: z.string(),
});

// `page-builder` is deliberately absent here — see `FixedShapeDomain` above.
export const RESULT_SCHEMA_BY_DOMAIN = {
	services: ServicesTranslationResultSchema,
	pages: PagesTranslationResultSchema,
	portfolio: PortfolioTranslationResultSchema,
	collaborators: CollaboratorsTranslationResultSchema,
	forms: FormsTranslationResultSchema,
	categories: CategoriesTranslationResultSchema,
	tags: TagsTranslationResultSchema,
	blog: BlogTranslationResultSchema,
} satisfies Record<FixedShapeDomain, z.ZodTypeAny>;

export type ServicesTranslationResult = z.infer<
	typeof ServicesTranslationResultSchema
>;
