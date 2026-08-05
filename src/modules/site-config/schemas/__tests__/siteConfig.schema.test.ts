import { describe, it, expect } from 'vitest';
import { SiteConfigUpdateSchema } from '../siteConfig.schema';

describe('SiteConfigUpdateSchema — contentLanguages', () => {
	it('accepts a valid non-empty subset of supported languages', () => {
		const result = SiteConfigUpdateSchema.safeParse({
			contentLanguages: ['es', 'en'],
		});
		expect(result.success).toBe(true);
	});

	it('rejects an empty array', () => {
		const result = SiteConfigUpdateSchema.safeParse({ contentLanguages: [] });
		expect(result.success).toBe(false);
	});

	it('rejects a language code outside SUPPORTED_LANGUAGES', () => {
		const result = SiteConfigUpdateSchema.safeParse({
			contentLanguages: ['es', 'xx'],
		});
		expect(result.success).toBe(false);
	});

	it('rejects duplicate language codes', () => {
		const result = SiteConfigUpdateSchema.safeParse({
			contentLanguages: ['es', 'en', 'es'],
		});
		expect(result.success).toBe(false);
	});

	it('accepts an update touching only contentLanguages (satisfies the empty-update refine)', () => {
		const result = SiteConfigUpdateSchema.safeParse({
			contentLanguages: ['en'],
		});
		expect(result.success).toBe(true);
	});

	it('still rejects a truly empty update (no keys at all)', () => {
		const result = SiteConfigUpdateSchema.safeParse({});
		expect(result.success).toBe(false);
	});
});
