import { z } from 'zod';
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
	categories: 'Categories',
	tags: 'Tags',
	'page-builder': 'Page content',
	blog: 'Blog',
};

// `page-builder`'s fields are a dynamic bag (see FixedShapeDomain in the
// schema module) — there's no fixed result shape to look up in
// `RESULT_SCHEMA_BY_DOMAIN`. Its result schema is built here, per request,
// from the actual keys the frontend sent: every key becomes a real
// `properties` entry, so the resulting JSON schema is still strict/closed
// (required by Anthropic's structured-output mode) without needing to know
// the keys in advance.
function resultSchemaFor(input: SuggestTranslationInput) {
	if (input.domain === 'page-builder') {
		return z.object(
			Object.fromEntries(Object.keys(input.fields).map((key) => [key, z.string()])),
		);
	}
	return RESULT_SCHEMA_BY_DOMAIN[input.domain];
}

export async function suggestTranslation(input: SuggestTranslationInput) {
	if (!ENV.ANTHROPIC_API_KEY) throw new TranslationNotConfiguredError();

	const transport = getTranslationTransport();
	const fields = await transport.suggest({
		domainLabel: DOMAIN_LABELS[input.domain],
		sourceLanguageName: LANGUAGE_NAMES[input.sourceLanguage],
		targetLanguageName: LANGUAGE_NAMES[input.targetLanguage],
		fields: input.fields,
		resultSchema: resultSchemaFor(input),
	});

	return { targetLanguage: input.targetLanguage, fields };
}
