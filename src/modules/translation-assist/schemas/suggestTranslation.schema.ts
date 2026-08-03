import { z } from 'zod';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';

// Pilot: only 'services'. Widen this enum (and DOMAIN_LABELS/the result
// schema dispatch in application/suggestTranslation.ts) when the other CMS
// domains (Pages, Portfolio, Collaborators, Forms, Categories, Tags) get
// this feature — no restructuring needed, just more entries.
export const TRANSLATION_DOMAINS = ['services'] as const;

const ServicesFieldsSchema = z.object({
	name: z.string().trim().min(1).max(200),
	shortDescription: z.string().trim().min(1).max(500),
	// Rich HTML from the editor — sanitized already on save; not re-sanitized
	// here since this text never gets persisted, only echoed back translated.
	description: z.string().trim().min(1).max(20_000),
});

export const SuggestTranslationSchema = z
	.object({
		domain: z.enum(TRANSLATION_DOMAINS),
		// Both dynamic — the source is whatever language the editor currently
		// has active in their own UI (never assumed to be Spanish or any other
		// fixed language), the target is whichever tab they're filling in.
		sourceLanguage: z.enum(SUPPORTED_LANGUAGES),
		targetLanguage: z.enum(SUPPORTED_LANGUAGES),
		fields: ServicesFieldsSchema,
	})
	.refine((data) => data.sourceLanguage !== data.targetLanguage, {
		message: 'TRANSLATION_SOURCE_EQUALS_TARGET',
		path: ['targetLanguage'],
	});

export type SuggestTranslationInput = z.infer<typeof SuggestTranslationSchema>;

// Structured-output schema the model's response must match — same 3-key
// shape as `ServicesFieldsSchema` above, kept separate (not `.pick()`'d from
// the request schema) since it's an output contract with no `.trim()`/
// `.min()` request-side refinements.
export const ServicesTranslationResultSchema = z.object({
	name: z.string(),
	shortDescription: z.string(),
	description: z.string(),
});

export type ServicesTranslationResult = z.infer<
	typeof ServicesTranslationResultSchema
>;
