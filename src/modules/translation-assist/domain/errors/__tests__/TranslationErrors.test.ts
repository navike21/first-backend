import { describe, it, expect } from 'vitest';
import {
	TranslationNotConfiguredError,
	TranslationProviderError,
} from '@Modules/translation-assist/domain/errors/TranslationErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Translation-assist domain errors', () => {
	it('TranslationNotConfiguredError has correct code and status', () => {
		const error = new TranslationNotConfiguredError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(503);
		expect(error.code).toBe('TRANSLATION_NOT_CONFIGURED');
	});

	it('TranslationProviderError has correct code and status, and carries details', () => {
		const error = new TranslationProviderError('timeout after 20s');
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(502);
		expect(error.code).toBe('TRANSLATION_PROVIDER_ERROR');
		expect(error.details).toBe('timeout after 20s');
	});

	it('TranslationProviderError works without details', () => {
		const error = new TranslationProviderError();
		expect(error.details).toBeUndefined();
	});
});
