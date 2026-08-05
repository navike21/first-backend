import { ENV } from '@Constants/environments';
import { TranslationNotConfiguredError } from '../domain/errors/TranslationErrors';
import { getTranslationTransport } from '../infrastructure/transport/getTranslationTransport';
import { LANGUAGE_NAMES } from '../constants/languageNames';
import { RESULT_SCHEMA_BY_DOMAIN } from '../schemas/suggestTranslation.schema';
import type { SuggestTranslationInput } from '../schemas/suggestTranslation.schema';

const DOMAIN_LABELS: Record<SuggestTranslationInput['domain'], string> = {
	services: 'Services',
	pages: 'Pages',
	portfolio: 'Portfolio',
	collaborators: 'Collaborators',
	forms: 'Forms',
};

export async function suggestTranslation(input: SuggestTranslationInput) {
	if (!ENV.ANTHROPIC_API_KEY) throw new TranslationNotConfiguredError();

	const transport = getTranslationTransport();
	const fields = await transport.suggest({
		domainLabel: DOMAIN_LABELS[input.domain],
		sourceLanguageName: LANGUAGE_NAMES[input.sourceLanguage],
		targetLanguageName: LANGUAGE_NAMES[input.targetLanguage],
		fields: input.fields,
		resultSchema: RESULT_SCHEMA_BY_DOMAIN[input.domain],
	});

	return { targetLanguage: input.targetLanguage, fields };
}
