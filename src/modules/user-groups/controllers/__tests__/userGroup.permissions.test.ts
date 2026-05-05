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

import { listPermissionCatalogController } from '@Modules/user-groups/controllers/userGroup.permissions';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('listPermissionCatalogController', () => {
	it('returns the permissions catalog', async () => {
		const req = {} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await listPermissionCatalogController(req, res, next);
		expect(successResponse).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalledWith(expect.any(Error));
	});
});
