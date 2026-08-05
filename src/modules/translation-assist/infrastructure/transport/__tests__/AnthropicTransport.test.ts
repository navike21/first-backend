import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockParse } = vi.hoisted(() => ({ mockParse: vi.fn() }));

vi.mock('@anthropic-ai/sdk', () => ({
	// A `new`-able mock needs a real `function`/`class` implementation — an
	// arrow function throws "is not a constructor" the instant `new Anthropic(...)`
	// runs in the module under test.
	default: vi.fn().mockImplementation(function AnthropicMock() {
		return { messages: { parse: mockParse } };
	}),
}));

vi.mock('@anthropic-ai/sdk/helpers/zod', () => ({
	zodOutputFormat: vi.fn((schema: unknown) => ({ __schema: schema })),
}));

vi.mock('@Constants/environments', () => ({
	ENV: {
		ANTHROPIC_API_KEY: 'test-key',
		ANTHROPIC_MODEL: 'claude-haiku-4-5-20251001',
	},
}));

const { anthropicTransport } = await import('../AnthropicTransport');
const { TranslationProviderError } = await import(
	'../../../domain/errors/TranslationErrors'
);
const { RESULT_SCHEMA_BY_DOMAIN } = await import(
	'../../../schemas/suggestTranslation.schema'
);

const resultSchema = RESULT_SCHEMA_BY_DOMAIN.services;

const fields = {
	name: 'Digital Transformation Consulting',
	shortDescription: 'We guide your company on its path to digital transformation.',
	description: '<p>We help organizations modernize their processes.</p>',
};

describe('anthropicTransport', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls the SDK with model/system/messages/output_config and returns parsed_output', async () => {
		mockParse.mockResolvedValue({
			parsed_output: {
				name: 'Consultoría en Transformación Digital',
				shortDescription: 'Acompañamos...',
				description: '<p>Ayudamos...</p>',
			},
		});

		const result = await anthropicTransport.suggest({
			domainLabel: 'Services',
			sourceLanguageName: 'English',
			targetLanguageName: 'Spanish',
			fields,
			resultSchema,
		});

		expect(result).toEqual({
			name: 'Consultoría en Transformación Digital',
			shortDescription: 'Acompañamos...',
			description: '<p>Ayudamos...</p>',
		});

		expect(mockParse).toHaveBeenCalledTimes(1);
		const [params, options] = mockParse.mock.calls[0];
		expect(params.model).toBe('claude-haiku-4-5-20251001');
		expect(params.max_tokens).toBeGreaterThanOrEqual(512);
		expect(params.max_tokens).toBeLessThanOrEqual(4096);
		expect(params.system).toEqual([
			expect.objectContaining({
				type: 'text',
				cache_control: { type: 'ephemeral' },
			}),
		]);
		expect(params.messages).toEqual([
			{
				role: 'user',
				content: expect.stringContaining('English'),
			},
		]);
		expect(params.messages[0].content).toContain('Spanish');
		expect(params.output_config.format).toEqual({ __schema: expect.anything() });
		expect(options).toEqual({ timeout: 20_000, maxRetries: 1 });
	});

	it('caps max_tokens for a very large source text and floors it for a tiny one', async () => {
		mockParse.mockResolvedValue({ parsed_output: fields });

		await anthropicTransport.suggest({
			domainLabel: 'Services',
			sourceLanguageName: 'English',
			targetLanguageName: 'German',
			fields: {
				name: 'x'.repeat(20_000),
				shortDescription: 'x'.repeat(20_000),
				description: 'x'.repeat(20_000),
			},
			resultSchema,
		});
		expect(mockParse.mock.calls[0][0].max_tokens).toBe(4096);

		mockParse.mockClear();
		await anthropicTransport.suggest({
			domainLabel: 'Services',
			sourceLanguageName: 'English',
			targetLanguageName: 'German',
			fields: { name: 'Hi', shortDescription: 'Hi', description: 'Hi' },
			resultSchema,
		});
		expect(mockParse.mock.calls[0][0].max_tokens).toBe(512);
	});

	it('wraps an SDK rejection in TranslationProviderError', async () => {
		mockParse.mockRejectedValue(new Error('connection timed out'));

		await expect(
			anthropicTransport.suggest({
				domainLabel: 'Services',
				sourceLanguageName: 'English',
				targetLanguageName: 'Spanish',
				fields,
				resultSchema,
			}),
		).rejects.toBeInstanceOf(TranslationProviderError);
	});

	it('throws TranslationProviderError when the response has no parsed_output', async () => {
		mockParse.mockResolvedValue({ parsed_output: undefined });

		await expect(
			anthropicTransport.suggest({
				domainLabel: 'Services',
				sourceLanguageName: 'English',
				targetLanguageName: 'Spanish',
				fields,
				resultSchema,
			}),
		).rejects.toBeInstanceOf(TranslationProviderError);
	});
});
