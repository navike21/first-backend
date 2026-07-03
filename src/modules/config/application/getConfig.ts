import {
	CURRENCIES,
	DOCUMENT_TYPES,
	INDUSTRIES,
	LANGUAGES,
	type LocalizedLabel,
} from '../data';

export const CONFIG_GROUPS = [
	'currencies',
	'documentTypes',
	'languages',
	'industries',
] as const;
export type ConfigGroup = (typeof CONFIG_GROUPS)[number];

function resolve(label: LocalizedLabel, lang: string): string {
	// Labels are authored in es + en; other languages fall back to English
	// (same convention as the module i18n stubs).
	return lang === 'es' ? label.es : label.en;
}

/**
 * Returns the requested reference-data groups with labels resolved to `lang`.
 * Unknown groups are ignored; unlisted groups are omitted from the response so
 * a single call fetches exactly what the client asked for.
 */
export function getConfig(groups: string[], lang: string) {
	const want = (g: ConfigGroup) => groups.includes(g);
	const result: Record<string, unknown> = {};

	if (want('currencies')) {
		result.currencies = CURRENCIES.map((c) => ({
			value: c.value,
			label: resolve(c.label, lang),
			symbol: c.symbol,
		}));
	}
	if (want('documentTypes')) {
		result.documentTypes = DOCUMENT_TYPES.map((d) => ({
			value: d.value,
			label: resolve(d.label, lang),
			pattern: d.pattern,
			maxLength: d.maxLength,
		}));
	}
	if (want('languages')) {
		result.languages = LANGUAGES.map((l) => ({ value: l.value, label: l.label }));
	}
	if (want('industries')) {
		result.industries = INDUSTRIES.map((i) => ({
			value: i.value,
			label: resolve(i.label, lang),
		}));
	}

	return result;
}
