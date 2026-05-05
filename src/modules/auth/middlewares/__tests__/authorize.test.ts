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

import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';

function makeRes(permissions: string[] = []) {
	return { locals: { permissions } } as unknown as Response;
}

describe('authorize', () => {
	it('calls next with no args when user has the required permission', async () => {
		const middleware = authorize(PERMISSIONS.USERS_READ);
		const req = {} as Request;
		const res = makeRes(['users:read']);
		const next = vi.fn();
		await middleware(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('calls next with no args when user has wildcard permission', async () => {
		const middleware = authorize(PERMISSIONS.USERS_READ);
		const req = {} as Request;
		const res = makeRes(['*:*']);
		const next = vi.fn();
		await middleware(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it('calls next with error when user lacks permission', async () => {
		const middleware = authorize(PERMISSIONS.USERS_DELETE);
		const req = {} as Request;
		const res = makeRes(['users:read']);
		const next = vi.fn();
		await middleware(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('calls next with error when permissions is empty', async () => {
		const middleware = authorize(PERMISSIONS.USERS_READ);
		const req = {} as Request;
		const res = makeRes([]);
		const next = vi.fn();
		await middleware(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('defaults to empty array when permissions is absent from locals', async () => {
		const middleware = authorize(PERMISSIONS.USERS_READ);
		const req = {} as Request;
		const res = { locals: {} } as unknown as Response;
		const next = vi.fn();
		await middleware(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
