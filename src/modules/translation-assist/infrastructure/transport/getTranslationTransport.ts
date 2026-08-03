import type { TranslationTransport } from './TranslationTransport';
import { anthropicTransport } from './AnthropicTransport';

/**
 * Only one provider today (Anthropic), but kept as a selector — same
 * indirection as getEmailTransport — so a second provider or a fallback
 * chain can be added later without the use-case ever knowing which one runs.
 */
export function getTranslationTransport(): TranslationTransport {
	return anthropicTransport;
}
