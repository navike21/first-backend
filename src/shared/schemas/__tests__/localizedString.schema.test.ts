import { describe, it, expect } from 'vitest';
import {
	LocalizedStringSchema,
	LocalizedHtmlStringSchema,
} from '@Shared/schemas/localizedString.schema';

const allLangs = (value: string) => ({
	en: value,
	es: value,
	de: value,
	fr: value,
	it: value,
	ja: value,
	ko: value,
	pt: value,
	ru: value,
	zh: value,
});

describe('LocalizedStringSchema', () => {
	it('trims plain text but does not sanitize HTML', () => {
		const result = LocalizedStringSchema.parse(allLangs('  <b>hi</b>  '));
		expect(result.en).toBe('<b>hi</b>');
	});
});

describe('LocalizedHtmlStringSchema', () => {
	it('strips a script tag (stored-XSS payload)', () => {
		const result = LocalizedHtmlStringSchema.parse(
			allLangs('<p>hello</p><script>alert(1)</script>'),
		);
		expect(result.en).toBe('<p>hello</p>');
	});

	it('strips an onerror handler on an otherwise-allowed tag', () => {
		const result = LocalizedHtmlStringSchema.parse(
			allLangs('<img src="x" onerror="alert(1)">'),
		);
		expect(result.en).not.toContain('onerror');
	});

	it('keeps allowed formatting tags intact', () => {
		const result = LocalizedHtmlStringSchema.parse(
			allLangs('<p><strong>bold</strong> and <em>italic</em></p>'),
		);
		expect(result.en).toBe('<p><strong>bold</strong> and <em>italic</em></p>');
	});

	it('keeps a safe link with an allowed attribute', () => {
		const result = LocalizedHtmlStringSchema.parse(
			allLangs('<a href="https://example.com">link</a>'),
		);
		expect(result.en).toBe('<a href="https://example.com">link</a>');
	});

	it('drops a javascript: URL scheme', () => {
		const result = LocalizedHtmlStringSchema.parse(
			allLangs('<a href="javascript:alert(1)">link</a>'),
		);
		expect(result.en).not.toContain('javascript:');
	});
});
