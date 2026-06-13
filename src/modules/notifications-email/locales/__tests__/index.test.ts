import { describe, it, expect } from 'vitest';
import { getEmailLocale, t } from '@Modules/notifications-email/locales';

describe('getEmailLocale', () => {
	it('returns English locale by default for unsupported language', () => {
		const locale = getEmailLocale('xx');
		// Brand is now an {{appName}} placeholder (interpolated by the template).
		expect(locale.welcomeEmail.subject).toBe('Welcome to {{appName}}!');
	});

	it('returns the correct locale for a supported language', () => {
		const locale = getEmailLocale('es');
		expect(locale.welcomeEmail.subject).toBe('¡Bienvenido a {{appName}}!');
	});
});

describe('t', () => {
	it('resolves a nested key and interpolates variables', () => {
		const locale = getEmailLocale('en');
		const result = t(locale, 'welcomeEmail.heading', { firstName: 'Alice' });
		expect(result).toBe('Welcome, Alice!');
	});

	it('returns the path when the key does not exist', () => {
		const locale = getEmailLocale('en');
		const result = t(locale, 'nonexistent.key');
		expect(result).toBe('nonexistent.key');
	});

	it('returns the path when traversal reaches a non-object intermediate', () => {
		const locale = getEmailLocale('en');
		// 'footer' is a string, not an object — traversing into it should return the path
		const result = t(locale, 'footer.nested');
		expect(result).toBe('footer.nested');
	});

	it('returns the path when the resolved value is not a string', () => {
		const locale = getEmailLocale('en');
		// 'verifyEmail' resolves to an object, not a string
		const result = t(locale, 'verifyEmail');
		expect(result).toBe('verifyEmail');
	});

	it('replaces missing interpolation vars with empty string', () => {
		const locale = getEmailLocale('en');
		// passing no vars — {{firstName}} should become ''
		const result = t(locale, 'welcomeEmail.heading', {});
		expect(result).toBe('Welcome, !');
	});
});
