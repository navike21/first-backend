import { z } from 'zod';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';

export const TRANSLATION_DOMAINS = [
	'services',
	'pages',
	'portfolio',
	'collaborators',
	'forms',
] as const;

export type TranslationDomain = (typeof TRANSLATION_DOMAINS)[number];

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

const FIELDS_SCHEMA_BY_DOMAIN = {
	services: ServicesFieldsSchema,
	pages: PagesFieldsSchema,
	portfolio: PortfolioFieldsSchema,
	collaborators: CollaboratorsFieldsSchema,
	forms: FormsFieldsSchema,
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

export const RESULT_SCHEMA_BY_DOMAIN = {
	services: ServicesTranslationResultSchema,
	pages: PagesTranslationResultSchema,
	portfolio: PortfolioTranslationResultSchema,
	collaborators: CollaboratorsTranslationResultSchema,
	forms: FormsTranslationResultSchema,
} satisfies Record<TranslationDomain, z.ZodTypeAny>;

export type ServicesTranslationResult = z.infer<
	typeof ServicesTranslationResultSchema
>;
