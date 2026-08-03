import { ENV } from '@Constants/environments';
import { TranslationNotConfiguredError } from '../domain/errors/TranslationErrors';
import { getTranslationTransport } from '../infrastructure/transport/getTranslationTransport';
import { LANGUAGE_NAMES } from '../constants/languageNames';
import type { SuggestTranslationInput } from '../schemas/suggestTranslation.schema';

// Widen alongside TRANSLATION_DOMAINS in the schema when more domains land.
const DOMAIN_LABELS: Record<SuggestTranslationInput['domain'], string> = {
	services: 'Services',
};

export async function suggestTranslation(input: SuggestTranslationInput) {
	if (!ENV.ANTHROPIC_API_KEY) throw new TranslationNotConfiguredError();

	const transport = getTranslationTransport();
	const fields = await transport.suggest({
		domainLabel: DOMAIN_LABELS[input.domain],
		sourceLanguageName: LANGUAGE_NAMES[input.sourceLanguage],
		targetLanguageName: LANGUAGE_NAMES[input.targetLanguage],
		fields: input.fields,
	});

	return { targetLanguage: input.targetLanguage, fields };
}
