import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/translation-assist/application/suggestTranslation', () => ({
	suggestTranslation: vi.fn(),
}));

import { translationSuggestController } from '@Modules/translation-assist/controllers/translation.suggest';
import { suggestTranslation } from '@Modules/translation-assist/application/suggestTranslation';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

const validBody = {
	domain: 'services',
	sourceLanguage: 'en',
	targetLanguage: 'de',
	fields: {
		name: 'Digital Transformation Consulting',
		shortDescription: 'We guide your company...',
		description: '<p>We help organizations...</p>',
	},
};

describe('translationSuggestController', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('validates the body, calls suggestTranslation, and returns 200', async () => {
		vi.mocked(suggestTranslation).mockResolvedValue({
			targetLanguage: 'de',
			fields: {
				name: 'x',
				shortDescription: 'y',
				description: 'z',
			},
		} as never);

		const req = { body: validBody } as unknown as Request;
		await translationSuggestController(req, makeRes(), vi.fn());

		expect(suggestTranslation).toHaveBeenCalledWith(validBody);
		expect(successResponse).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				statusCode: 200,
				code: 'TRANSLATION_SUGGESTION_OK',
			}),
		);
	});

	it('calls next with a validation error when sourceLanguage equals targetLanguage', async () => {
		const req = {
			body: { ...validBody, targetLanguage: 'en' },
		} as unknown as Request;
		const next = vi.fn();
		await translationSuggestController(req, makeRes(), next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
		expect(suggestTranslation).not.toHaveBeenCalled();
	});
});
