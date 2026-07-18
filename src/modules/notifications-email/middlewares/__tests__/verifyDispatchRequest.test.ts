import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response } from 'express';

const { errorSpy, mockEnv } = vi.hoisted(() => ({
	errorSpy: vi.fn(),
	mockEnv: { EMAIL_DISPATCH_SECRET: undefined as string | undefined, NODE_ENV: 'test' },
}));

vi.mock('@Constants/environments', () => ({
	get ENV() {
		return mockEnv;
	},
}));
vi.mock('@Helpers/responseStructure', () => ({
	errorResponse: (_res: unknown, opts: { statusCode: number }) => errorSpy(opts),
}));

import { verifyDispatchRequest } from '@Modules/notifications-email/middlewares/verifyDispatchRequest';

function makeReq(authorization?: string): Request {
	return {
		header: (name: string) =>
			name.toLowerCase() === 'authorization' ? authorization : undefined,
	} as unknown as Request;
}

const res = {} as Response;

describe('verifyDispatchRequest', () => {
	beforeEach(() => {
		errorSpy.mockReset();
		mockEnv.EMAIL_DISPATCH_SECRET = undefined;
		mockEnv.NODE_ENV = 'test';
	});

	it('allows when no secret configured in non-production', () => {
		const next = vi.fn();
		verifyDispatchRequest(makeReq(), res, next);
		expect(next).toHaveBeenCalledOnce();
		expect(errorSpy).not.toHaveBeenCalled();
	});

	it('fails closed (503) when no secret configured in production', () => {
		mockEnv.NODE_ENV = 'production';
		const next = vi.fn();
		verifyDispatchRequest(makeReq(), res, next);
		expect(next).not.toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalledWith(
			expect.objectContaining({ statusCode: 503 }),
		);
	});

	it('rejects (401) a wrong bearer when a secret is set', () => {
		mockEnv.EMAIL_DISPATCH_SECRET = 'topsecret';
		const next = vi.fn();
		verifyDispatchRequest(makeReq('Bearer nope'), res, next);
		expect(next).not.toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalledWith(
			expect.objectContaining({ statusCode: 401 }),
		);
	});

	it('allows the correct bearer', () => {
		mockEnv.EMAIL_DISPATCH_SECRET = 'topsecret';
		const next = vi.fn();
		verifyDispatchRequest(makeReq('Bearer topsecret'), res, next);
		expect(next).toHaveBeenCalledOnce();
		expect(errorSpy).not.toHaveBeenCalled();
	});
});
