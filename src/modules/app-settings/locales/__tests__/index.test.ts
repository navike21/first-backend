import { describe, it, expect } from 'vitest';
import { appSettingsLocales } from '../index';

describe('appSettingsLocales', () => {
	it('exports an object with locale keys for all supported languages', () => {
		const langs = ['en', 'es', 'de', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'];
		for (const lang of langs) {
			expect(appSettingsLocales).toHaveProperty(lang);
		}
	});

	it('each locale has the required message keys', () => {
		const keys = ['SUCCESS_APP_SETTINGS_FOUND', 'SUCCESS_APP_SETTINGS_UPDATED'];
		for (const lang of Object.keys(appSettingsLocales)) {
			const locale = appSettingsLocales[lang as keyof typeof appSettingsLocales];
			for (const key of keys) {
				expect(locale).toHaveProperty(key);
				expect(typeof (locale as Record<string, string>)[key]).toBe('string');
			}
		}
	});
});
