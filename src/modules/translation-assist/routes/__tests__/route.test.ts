import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test', ANTHROPIC_MODEL: 'claude-haiku-4-5-20251001' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/translation-assist/application/suggestTranslation', () => ({
	suggestTranslation: vi.fn(),
}));

import { Router } from 'express';
import { translationAssistApi } from '@Modules/translation-assist/routes/route';

describe('translationAssistApi route', () => {
	it('registers the suggest route on the router without throwing', () => {
		const router = Router();
		expect(() => translationAssistApi(router)).not.toThrow();
	});
});
