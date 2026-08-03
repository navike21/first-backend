import { AppError } from '@Shared/domain/AppError';

export class TranslationNotConfiguredError extends AppError {
	constructor() {
		super({
			statusCode: 503,
			code: 'TRANSLATION_NOT_CONFIGURED',
			message: 'AI translation is not configured yet',
		});
	}
}

export class TranslationProviderError extends AppError {
	constructor(details?: unknown) {
		super({
			statusCode: 502,
			code: 'TRANSLATION_PROVIDER_ERROR',
			message: 'The AI translation provider is currently unavailable',
			details,
		});
	}
}
