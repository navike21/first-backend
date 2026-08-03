import type { SupportedLanguage } from '@Shared/types/localizedString';

/** English name of each supported language, used to build a readable prompt
 * for the model (e.g. "Translate the following English content into
 * German") — the model call always names both languages explicitly, never
 * assumes a fixed source language. */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
	en: 'English',
	es: 'Spanish',
	de: 'German',
	fr: 'French',
	it: 'Italian',
	ja: 'Japanese',
	ko: 'Korean',
	pt: 'Portuguese',
	ru: 'Russian',
	zh: 'Chinese',
};
