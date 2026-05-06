import en from './en/emails.json';
import es from './es/emails.json';
import de from './de/emails.json';
import fr from './fr/emails.json';
import it from './it/emails.json';
import ja from './ja/emails.json';
import ko from './ko/emails.json';
import pt from './pt/emails.json';
import ru from './ru/emails.json';
import zh from './zh/emails.json';

const emailLocales = { en, es, de, fr, it, ja, ko, pt, ru, zh } as const;

type SupportedEmailLang = keyof typeof emailLocales;

export type EmailLocale = (typeof emailLocales)[SupportedEmailLang];

export function getEmailLocale(lang: string): EmailLocale {
	const key = lang as SupportedEmailLang;
	return emailLocales[key] ?? emailLocales.en;
}

function interpolate(str: string, vars: Record<string, string>): string {
	return str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

export function t(
	locale: EmailLocale,
	path: string,
	vars: Record<string, string> = {},
): string {
	const keys = path.split('.');
	let value: unknown = locale;
	for (const key of keys) {
		if (typeof value !== 'object' || value === null) return path;
		value = (value as Record<string, unknown>)[key];
	}
	if (typeof value !== 'string') return path;
	return interpolate(value, vars);
}
