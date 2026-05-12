import { describe, it, expect } from 'vitest';
import { auditLogLocales } from '../index';

describe('auditLogLocales', () => {
	it('exports an object with locale keys for all supported languages', () => {
		const langs = ['en', 'es', 'de', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'];
		for (const lang of langs) {
			expect(auditLogLocales).toHaveProperty(lang);
		}
	});

	it('each locale has the required message keys', () => {
		const keys = ['SUCCESS_AUDIT_LOGS_LIST', 'SUCCESS_AUDIT_LOG_FOUND'];
		for (const lang of Object.keys(auditLogLocales)) {
			const locale = auditLogLocales[lang as keyof typeof auditLogLocales];
			for (const key of keys) {
				expect(locale).toHaveProperty(key);
				expect(typeof (locale as Record<string, string>)[key]).toBe('string');
			}
		}
	});
});
