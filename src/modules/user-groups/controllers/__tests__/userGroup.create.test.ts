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
vi.mock('@Modules/user-groups/application/createUserGroup', () => ({
	createUserGroup: vi.fn(),
}));

import { createUserGroupController } from '@Modules/user-groups/controllers/userGroup.create';
import { createUserGroup } from '@Modules/user-groups/application/createUserGroup';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('createUserGroupController', () => {
	it('calls createUserGroup on valid input', async () => {
		vi.mocked(createUserGroup).mockResolvedValue({
			id: '1',
			name: 'Admins',
		} as never);
		const req = {
			body: { name: 'Admins', permissions: [] },
		} as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await createUserGroupController(req, res, next);
		expect(createUserGroup).toHaveBeenCalled();
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: {} } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();
		await createUserGroupController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
