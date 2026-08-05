import type { z } from 'zod';
import type { TranslatableFields } from '../../constants/prompt';

export interface SuggestTranslationInput {
	domainLabel: string;
	sourceLanguageName: string;
	targetLanguageName: string;
	fields: TranslatableFields;
	// The domain's own result schema (from RESULT_SCHEMA_BY_DOMAIN) — the
	// transport validates the model's structured output against this, so it
	// never needs to know which domain (or field shape) is calling it.
	resultSchema: z.ZodTypeAny;
}

/**
 * Abstraction over the AI provider. Only one impl exists today
 * (AnthropicTransport), but this mirrors EmailTransport's pattern
 * (application code only knows this interface) so swapping/adding a
 * provider later doesn't touch the use-case. Must THROW on failure — the
 * use-case maps that into TranslationProviderError.
 */
export interface TranslationTransport {
	readonly name: string;
	suggest(input: SuggestTranslationInput): Promise<TranslatableFields>;
}
