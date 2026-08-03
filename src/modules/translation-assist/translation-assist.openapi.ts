import { z } from 'zod';
import type { ResponseConfig } from '@asteasolutions/zod-to-openapi';
import { registry } from '@Config/openapi/registry';
import {
	successResponse,
	commonErrorResponses,
} from '@Config/openapi/responses';
import { TRANSLATION_DOMAINS } from './schemas/suggestTranslation.schema';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';

const bearerAuth = [{ bearerAuth: [] }];

// Not in commonErrorResponses (no other route in the app returns these) —
// same shape as its private errorResponse() helper, defined locally here.
function providerErrorResponse(description: string): ResponseConfig {
	return {
		description,
		content: {
			'application/json': {
				schema: z.object({
					success: z.literal(false),
					statusCode: z.number(),
					message: z.string(),
					code: z.string(),
					error: z
						.object({ code: z.string(), details: z.unknown().optional() })
						.optional(),
				}),
			},
		},
	};
}

const suggestTranslationResponseSchema = registry.register(
	'TranslationSuggestion',
	z.object({
		targetLanguage: z.enum(SUPPORTED_LANGUAGES),
		fields: z.object({
			name: z.string(),
			shortDescription: z.string(),
			description: z.string(),
		}),
	}),
);

registry.registerPath({
	method: 'post',
	path: '/translation-assist/suggest',
	summary: 'Suggest an AI translation for one language, for one CMS record',
	description:
		'Requires `services:update` or `:manage`. Translates the given fields ' +
		'(all in `sourceLanguage`, the editor\'s own current UI language — ' +
		'never a fixed language) into `targetLanguage` in a single call. Rate ' +
		'limited per authenticated user (not per IP).',
	tags: ['Translation Assist'],
	security: bearerAuth,
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						domain: z.enum(TRANSLATION_DOMAINS),
						sourceLanguage: z.enum(SUPPORTED_LANGUAGES),
						targetLanguage: z.enum(SUPPORTED_LANGUAGES),
						fields: z.object({
							name: z.string(),
							shortDescription: z.string(),
							description: z.string(),
						}),
					}),
				},
			},
		},
	},
	responses: {
		200: successResponse(suggestTranslationResponseSchema),
		401: commonErrorResponses[401],
		403: commonErrorResponses[403],
		422: commonErrorResponses[422],
		429: commonErrorResponses[429],
		502: providerErrorResponse(
			'The AI translation provider is currently unavailable',
		),
		503: providerErrorResponse('AI translation is not configured yet'),
	},
});
