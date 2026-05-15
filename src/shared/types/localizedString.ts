export const SUPPORTED_LANGUAGES = [
	'en',
	'es',
	'de',
	'fr',
	'it',
	'ja',
	'ko',
	'pt',
	'ru',
	'zh',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type LocalizedString = Record<SupportedLanguage, string>;
