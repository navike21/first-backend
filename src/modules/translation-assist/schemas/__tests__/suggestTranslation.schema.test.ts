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

	it('rejects an unsupported domain', () => {
		const result = SuggestTranslationSchema.safeParse({
			domain: 'pages',
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
});
