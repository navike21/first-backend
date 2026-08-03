import type { TranslatableFields } from '../../constants/prompt';
import type { ServicesTranslationResult } from '../../schemas/suggestTranslation.schema';

export interface SuggestTranslationInput {
	domainLabel: string;
	sourceLanguageName: string;
	targetLanguageName: string;
	fields: TranslatableFields;
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
	suggest(input: SuggestTranslationInput): Promise<ServicesTranslationResult>;
}
