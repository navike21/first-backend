import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));

import { authorizeTranslationDomain } from '../authorizeTranslationDomain';

function makeReq(domain: string | undefined): Request {
	return { body: domain === undefined ? {} : { domain } } as unknown as Request;
}

function makeRes(permissions: string[] = []): Response {
	return { locals: { permissions } } as unknown as Response;
}

describe('authorizeTranslationDomain', () => {
	it('calls next with no args when the user has UPDATE on the request domain', async () => {
		const req = makeReq('services');
		const res = makeRes(['services:update']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('calls next with no args when the user has MANAGE on the request domain', async () => {
		const req = makeReq('pages');
		const res = makeRes(['pages:manage']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('calls next with no args for the wildcard super permission', async () => {
		const req = makeReq('forms');
		const res = makeRes(['*:*']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it("rejects when the user only has a DIFFERENT domain's permission (portfolio update doesn't grant collaborators)", async () => {
		const req = makeReq('collaborators');
		const res = makeRes(['portfolio:update', 'portfolio:manage']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('rejects when domain is missing from the body', async () => {
		const req = makeReq(undefined);
		const res = makeRes(['*:*']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('rejects an unrecognized domain even with broad permissions', async () => {
		const req = makeReq('categories');
		const res = makeRes(['categories:manage']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
