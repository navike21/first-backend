import { describe, it, expect } from 'vitest';
import { SuggestTranslationSchema } from '../suggestTranslation.schema';

const validFields = {
	name: 'Consultoría en Transformación Digital',
	shortDescription: 'Acompañamos a tu empresa en su transformación digital.',
	description: '<p>Ayudamos a organizaciones a modernizar sus procesos.</p>',
};

describe('SuggestTranslationSchema', () => {
	it('accepts a valid payload with distinct source/target languages', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'services',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: validFields,
		});
		expect(result.success).toBe(true);
	});

	it('accepts any supported language as the source, not just Spanish', () => {
		// The source is always the editor's own current language, never fixed.
		const result = SuggestTranslationSchema.safeParse({
			domain: 'services',
			sourceLanguage: 'pt',
			targetLanguage: 'ja',
			fields: validFields,
		});
		expect(result.success).toBe(true);
	});

	it('rejects when sourceLanguage equals targetLanguage, regardless of which language', () => {
		const enToEn = SuggestTranslationSchema.safeParse({
			domain: 'services',
			sourceLanguage: 'en',
			targetLanguage: 'en',
			fields: validFields,
		});
		expect(enToEn.success).toBe(false);

		const esToEs = SuggestTranslationSchema.safeParse({
			domain: 'services',
			sourceLanguage: 'es',
			targetLanguage: 'es',
			fields: validFields,
		});
		expect(esToEs.success).toBe(false);
	});

	it('rejects an empty name field', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'services',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: { ...validFields, name: '' },
		});
		expect(result.success).toBe(false);
	});

	it('rejects a domain this module does not support', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'unsupported-domain',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: validFields,
		});
		expect(result.success).toBe(false);
	});

	it('rejects an unsupported language code', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'services',
			sourceLanguage: 'en',
			targetLanguage: 'xx',
			fields: validFields,
		});
		expect(result.success).toBe(false);
	});

	it('accepts a valid Portfolio payload (same 3-field shape as Services)', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'portfolio',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: validFields,
		});
		expect(result.success).toBe(true);
	});

	it('accepts a valid Pages payload, with optional SEO fields blank', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'pages',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: {
				title: 'About us',
				description: '',
				metaTitle: '',
				metaDescription: '',
			},
		});
		expect(result.success).toBe(true);
	});

	it('rejects a Pages payload missing the required title field', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'pages',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: { title: '', description: '', metaTitle: '', metaDescription: '' },
		});
		expect(result.success).toBe(false);
	});

	it('accepts a valid Collaborators payload (bio only)', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'collaborators',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: { bio: 'Leads product teams since 2015...' },
		});
		expect(result.success).toBe(true);
	});

	it('accepts a valid Forms payload, with optional successMessage blank', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'forms',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: {
				title: 'Contact us',
				description: '',
				successMessage: '',
			},
		});
		expect(result.success).toBe(true);
	});

	it('rejects fields from a different domain than the one declared', () => {
		// domain: 'pages' but fields shaped like Services (name/shortDescription)
		// instead of Pages (title/description/metaTitle/metaDescription).
		const result = SuggestTranslationSchema.safeParse({
			domain: 'pages',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: validFields,
		});
		expect(result.success).toBe(false);
	});

	it('accepts a valid Categories payload (name only)', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'categories',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: { name: 'Web Development' },
		});
		expect(result.success).toBe(true);
	});

	it('accepts a valid Tags payload (name only)', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'tags',
			sourceLanguage: 'en',
			targetLanguage: 'de',
			fields: { name: 'Featured' },
		});
		expect(result.success).toBe(true);
	});

	describe('page-builder domain (dynamic field bag)', () => {
		it('accepts an arbitrary set of elementId-keyed fields', () => {
			const result = SuggestTranslationSchema.safeParse({
				domain: 'page-builder',
				sourceLanguage: 'en',
				targetLanguage: 'de',
				fields: {
					el1: '<p>Welcome to First</p>',
					'el2:it1:question': 'What is First?',
					'el2:it1:answer': '<p>A CRM+CMS platform.</p>',
					'el3:0:alt': 'Team photo',
				},
			});
			expect(result.success).toBe(true);
		});

		it('rejects an empty fields object', () => {
			const result = SuggestTranslationSchema.safeParse({
				domain: 'page-builder',
				sourceLanguage: 'en',
				targetLanguage: 'de',
				fields: {},
			});
			expect(result.success).toBe(false);
		});

		it('rejects more than 150 entries in a single request', () => {
			const fields = Object.fromEntries(
				Array.from({ length: 151 }, (_, i) => [`el${i}`, 'text']),
			);
			const result = SuggestTranslationSchema.safeParse({
				domain: 'page-builder',
				sourceLanguage: 'en',
				targetLanguage: 'de',
				fields,
			});
			expect(result.success).toBe(false);
		});

		it('rejects a payload whose combined field content exceeds the total size cap', () => {
			const longValue = 'a'.repeat(20_000);
			const result = SuggestTranslationSchema.safeParse({
				domain: 'page-builder',
				sourceLanguage: 'en',
				targetLanguage: 'de',
				fields: { el1: longValue, el2: longValue, el3: longValue, el4: longValue },
			});
			expect(result.success).toBe(false);
		});
	});
});
