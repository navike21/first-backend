import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSuggest, mockGetTransport } = vi.hoisted(() => ({
	mockSuggest: vi.fn(),
	mockGetTransport: vi.fn(),
}));

vi.mock('../../infrastructure/transport/getTranslationTransport', () => ({
	getTranslationTransport: mockGetTransport,
}));

const ENV_MOCK: { ANTHROPIC_API_KEY?: string } = {
	ANTHROPIC_API_KEY: 'test-key',
};
vi.mock('@Constants/environments', () => ({ ENV: ENV_MOCK }));

const { suggestTranslation } = await import('../suggestTranslation');
const { TranslationNotConfiguredError } = await import(
	'../../domain/errors/TranslationErrors'
);

const input = {
	domain: 'services' as const,
	sourceLanguage: 'en' as const,
	targetLanguage: 'de' as const,
	fields: {
		name: 'Digital Transformation Consulting',
		shortDescription: 'We guide your company...',
		description: '<p>We help organizations...</p>',
	},
};

describe('suggestTranslation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		ENV_MOCK.ANTHROPIC_API_KEY = 'test-key';
		mockGetTransport.mockReturnValue({ name: 'anthropic', suggest: mockSuggest });
	});

	it('throws TranslationNotConfiguredError without calling the transport when the API key is unset', async () => {
		ENV_MOCK.ANTHROPIC_API_KEY = undefined;

		await expect(suggestTranslation(input)).rejects.toBeInstanceOf(
			TranslationNotConfiguredError,
		);
		expect(mockGetTransport).not.toHaveBeenCalled();
		expect(mockSuggest).not.toHaveBeenCalled();
	});

	it('maps the input to the transport call with resolved language names, and returns the result', async () => {
		mockSuggest.mockResolvedValue({
			name: 'Beratung für digitale Transformation',
			shortDescription: 'Wir begleiten Ihr Unternehmen...',
			description: '<p>Wir helfen Organisationen...</p>',
		});

		const result = await suggestTranslation(input);

		expect(mockSuggest).toHaveBeenCalledWith({
			domainLabel: 'Services',
			sourceLanguageName: 'English',
			targetLanguageName: 'German',
			fields: input.fields,
		});
		expect(result).toEqual({
			targetLanguage: 'de',
			fields: {
				name: 'Beratung für digitale Transformation',
				shortDescription: 'Wir begleiten Ihr Unternehmen...',
				description: '<p>Wir helfen Organisationen...</p>',
			},
		});
	});
});
