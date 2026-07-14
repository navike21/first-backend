import {
	CLIENT_TYPES,
	COLLABORATOR_LEVELS,
	COLLABORATOR_ROLES,
	CURRENCIES,
	DOCUMENT_TYPES,
	GENDERS,
	INDUSTRIES,
	LANGUAGES,
	TECHNOLOGIES,
	type LocalizedLabel,
} from '../data';

export const CONFIG_GROUPS = [
	'currencies',
	'documentTypes',
	'languages',
	'industries',
	'clientTypes',
	'genders',
	'technologies',
	'collaboratorRoles',
	'collaboratorLevels',
] as const;
export type ConfigGroup = (typeof CONFIG_GROUPS)[number];

function resolve(label: LocalizedLabel, lang: string): string {
	return (label as unknown as Record<string, string>)[lang] ?? label.en;
}

function makeDisplayNames(
	type: 'language' | 'region',
	lang: string,
): Intl.DisplayNames | null {
	try {
		return new Intl.DisplayNames([lang], { type });
	} catch {
		return null;
	}
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
		const dn = makeDisplayNames('language', lang);
		result.languages = LANGUAGES.map((l) => ({
			value: l.value,
			// Localized name in the requested language (e.g. lang=es → "inglés", lang=en → "English")
			// Falls back to the endonym if Intl cannot resolve it.
			label: dn?.of(l.value) ?? l.label,
		}));
	}

	if (want('industries')) {
		result.industries = INDUSTRIES.map((i) => ({
			value: i.value,
			label: resolve(i.label, lang),
		}));
	}

	if (want('clientTypes')) {
		result.clientTypes = CLIENT_TYPES.map((c) => ({
			value: c.value,
			label: resolve(c.label, lang),
		}));
	}

	if (want('genders')) {
		result.genders = GENDERS.map((g) => ({
			value: g.value,
			label: resolve(g.label, lang),
		}));
	}

	if (want('technologies')) {
		result.technologies = TECHNOLOGIES.map((t) => ({
			value: t.value,
			label: t.label,
		}));
	}

	if (want('collaboratorRoles')) {
		result.collaboratorRoles = COLLABORATOR_ROLES.map((r) => ({
			value: r.value,
			label: resolve(r.label, lang),
		}));
	}

	if (want('collaboratorLevels')) {
		result.collaboratorLevels = COLLABORATOR_LEVELS.map((l) => ({
			value: l.value,
			label: resolve(l.label, lang),
		}));
	}

	return result;
}
