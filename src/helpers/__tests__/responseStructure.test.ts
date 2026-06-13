import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Response } from 'express';

vi.mock('@Config/i18n', () => ({
	default: {
		// Echo the key with a marker so we can assert translation was attempted.
		t: vi.fn((key: string) => (key === 'OK' ? 'OK' : `t:${key}`)),
	},
}));
vi.mock('../systemEnvironment', () => ({
	isDevelopmentEnvironment: () => ({ isDevelopment: false }),
}));
vi.mock('../log', () => ({ logError: vi.fn() }));

import { successResponse } from '../responseStructure';

function makeRes() {
	const json = vi.fn();
	const status = vi.fn(() => ({ json }));
	const res = { locals: { lang: 'en' }, status } as unknown as Response;
	return { res, status, json };
}

describe('successResponse warnings channel', () => {
	beforeEach(() => vi.clearAllMocks());

	it('omits warnings when none are provided', () => {
		const { res, json } = makeRes();
		successResponse(res, { data: { id: 1 }, code: 'OK' });
		expect(json.mock.calls[0][0]).not.toHaveProperty('warnings');
	});

	it('includes translated warnings when provided', () => {
		const { res, json } = makeRes();
		successResponse(res, {
			data: { id: 1 },
			statusCode: 201,
			code: 'SUCCESS',
			warnings: [
				{
					field: 'logo',
					code: 'IMAGE_UPLOAD_FAILED',
					message: 'fallback message',
				},
			],
		});

		const body = json.mock.calls[0][0];
		expect(body.warnings).toEqual([
			{
				field: 'logo',
				code: 'IMAGE_UPLOAD_FAILED',
				message: 't:IMAGE_UPLOAD_FAILED',
			},
		]);
	});

	it('omits warnings when an empty array is provided', () => {
		const { res, json } = makeRes();
		successResponse(res, { data: {}, code: 'OK', warnings: [] });
		expect(json.mock.calls[0][0]).not.toHaveProperty('warnings');
	});
});
