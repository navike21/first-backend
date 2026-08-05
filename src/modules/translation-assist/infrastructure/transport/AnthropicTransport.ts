import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { ENV } from '@Constants/environments';
import { SYSTEM_PROMPT, buildUserPrompt } from '../../constants/prompt';
import type { TranslatableFields } from '../../constants/prompt';
import { TranslationProviderError } from '../../domain/errors/TranslationErrors';
import type {
	SuggestTranslationInput,
	TranslationTransport,
} from './TranslationTransport';

let client: Anthropic | undefined;

function getClient(): Anthropic {
	if (!client) {
		if (!ENV.ANTHROPIC_API_KEY) {
			throw new Error('ANTHROPIC_API_KEY is not configured');
		}
		client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });
	}
	return client;
}

// Rough chars→tokens headroom (÷3, generous) + a fixed buffer for the
// structured-output scaffolding, capped so one call can never balloon in
// cost regardless of how much text is passed in. Applies uniformly to every
// domain (not branched per-domain) — 8192 leaves enough headroom for
// `page-builder`'s aggregated whole-page payload (several rich-text/FAQ/
// testimonial fields in one call) while staying a hard, bounded ceiling.
const MAX_TOKENS_CEILING = 8192;
const MAX_TOKENS_FLOOR = 512;

function estimateMaxTokens(sourceChars: number): number {
	return Math.min(
		MAX_TOKENS_CEILING,
		Math.max(MAX_TOKENS_FLOOR, Math.ceil(sourceChars / 3) + 256),
	);
}

export const anthropicTransport: TranslationTransport = {
	name: 'anthropic',
	async suggest({
		domainLabel,
		sourceLanguageName,
		targetLanguageName,
		fields,
		resultSchema,
	}: SuggestTranslationInput) {
		const sourceChars = Object.values(fields).reduce(
			(total, value) => total + value.length,
			0,
		);
		try {
			const response = await getClient().messages.parse(
				{
					model: ENV.ANTHROPIC_MODEL,
					max_tokens: estimateMaxTokens(sourceChars),
					// `cache_control` costs nothing to add even if this specific
					// prompt (~250-350 tokens) doesn't clear Anthropic's minimum
					// cacheable prefix for this model today — see the module's
					// plan notes. Harmless either way, and it starts paying off
					// automatically if the prompt grows later (e.g. once shared
					// across more domains).
					system: [
						{
							type: 'text',
							text: SYSTEM_PROMPT,
							cache_control: { type: 'ephemeral' },
						},
					],
					messages: [
						{
							role: 'user',
							content: buildUserPrompt(
								domainLabel,
								sourceLanguageName,
								targetLanguageName,
								fields,
							),
						},
					],
					output_config: {
						format: zodOutputFormat(resultSchema),
					},
				},
				// Bounded so a slow/hung call doesn't outlive the serverless
				// function's own timeout budget; a single retry is enough for a
				// transient network blip without doubling worst-case cost/latency.
				{ timeout: 20_000, maxRetries: 1 },
			);
			if (!response.parsed_output) {
				throw new Error('Anthropic response had no parsed_output');
			}
			// `resultSchema` is generic (`z.ZodTypeAny`) so the SDK can't narrow
			// `parsed_output`'s type from it — the schema itself is what actually
			// guarantees this is a flat string record at runtime.
			return response.parsed_output as TranslatableFields;
		} catch (error) {
			throw new TranslationProviderError(
				error instanceof Error ? error.message : undefined,
			);
		}
	},
};
