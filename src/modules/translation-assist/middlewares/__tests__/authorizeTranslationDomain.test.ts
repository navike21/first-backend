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
		const req = makeReq('unsupported-domain');
		const res = makeRes(['unsupported-domain:manage']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('calls next for categories with categories:update', async () => {
		const req = makeReq('categories');
		const res = makeRes(['categories:update']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('calls next for tags with tags:manage', async () => {
		const req = makeReq('tags');
		const res = makeRes(['tags:manage']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it("authorizes page-builder against the pages permission pair, not a permission of its own", async () => {
		const req = makeReq('page-builder');
		const res = makeRes(['pages:update']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('rejects page-builder when the user only has categories permissions', async () => {
		const req = makeReq('page-builder');
		const res = makeRes(['categories:manage']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('calls next for blog with blog:update', async () => {
		const req = makeReq('blog');
		const res = makeRes(['blog:update']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('rejects blog when the user only has a different domain permission', async () => {
		const req = makeReq('blog');
		const res = makeRes(['pages:manage']);
		const next = vi.fn();
		await authorizeTranslationDomain(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
