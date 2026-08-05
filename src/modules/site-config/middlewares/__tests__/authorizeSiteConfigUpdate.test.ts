import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));

import { authorizeSiteConfigUpdate } from '../authorizeSiteConfigUpdate';

function makeReq(body: Record<string, unknown>): Request {
	return { body } as unknown as Request;
}

function makeRes(permissions: string[] = []): Response {
	return { locals: { permissions } } as unknown as Response;
}

describe('authorizeSiteConfigUpdate', () => {
	it('allows a body containing ONLY contentLanguages with just the narrow site-config:languages permission', async () => {
		const req = makeReq({ contentLanguages: ['es', 'en'] });
		const res = makeRes(['site-config:languages']);
		const next = vi.fn();
		await authorizeSiteConfigUpdate(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('rejects a body containing ONLY contentLanguages when the user has neither site-config:languages nor site-config:update/manage', async () => {
		const req = makeReq({ contentLanguages: ['es', 'en'] });
		const res = makeRes(['pages:update']);
		const next = vi.fn();
		await authorizeSiteConfigUpdate(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('rejects a body containing contentLanguages PLUS another section with only the narrow permission', async () => {
		const req = makeReq({
			contentLanguages: ['es', 'en'],
			maps: { provider: 'osm' },
		});
		const res = makeRes(['site-config:languages']);
		const next = vi.fn();
		await authorizeSiteConfigUpdate(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('allows a body touching another section (with or without contentLanguages) when the user has site-config:update', async () => {
		const req = makeReq({ maps: { provider: 'osm' } });
		const res = makeRes(['site-config:update']);
		const next = vi.fn();
		await authorizeSiteConfigUpdate(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('allows any shape of body for the wildcard super permission', async () => {
		const req = makeReq({ header: { sticky: false } });
		const res = makeRes(['*:*']);
		const next = vi.fn();
		await authorizeSiteConfigUpdate(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('allows a body touching another section for site-config:manage even alongside contentLanguages', async () => {
		const req = makeReq({
			contentLanguages: ['es'],
			social: { facebook: 'https://facebook.com/x' },
		});
		const res = makeRes(['site-config:manage']);
		const next = vi.fn();
		await authorizeSiteConfigUpdate(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});
});
