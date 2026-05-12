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
vi.mock('@Modules/users/application/getMyProfile', () => ({
	getMyProfile: vi.fn(),
}));
vi.mock('@Modules/users/application/updateMyProfile', () => ({
	updateMyProfile: vi.fn(),
}));

import {
	getMyProfileController,
	updateMyProfileController,
} from '@Modules/users/controllers/user.profile';
import { getMyProfile } from '@Modules/users/application/getMyProfile';
import { updateMyProfile } from '@Modules/users/application/updateMyProfile';
import { successResponse } from '@Helpers/responseStructure';

function makeRes(locals: Record<string, unknown> = {}) {
	return {
		locals,
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('getMyProfileController', () => {
	it('calls getMyProfile with userId from locals', async () => {
		vi.mocked(getMyProfile).mockResolvedValue({ id: 'u1' } as never);
		const req = {} as unknown as Request;
		const res = makeRes({ userId: 'u1' });
		const next = vi.fn();
		await getMyProfileController(req, res, next);
		expect(getMyProfile).toHaveBeenCalledWith('u1');
		expect(successResponse).toHaveBeenCalled();
	});
});

describe('updateMyProfileController', () => {
	it('calls updateMyProfile on valid input', async () => {
		vi.mocked(updateMyProfile).mockResolvedValue({ id: 'u1' } as never);
		const req = { body: { firstName: 'Jane' } } as unknown as Request;
		const res = makeRes({ userId: 'u1' });
		const next = vi.fn();
		await updateMyProfileController(req, res, next);
		expect(updateMyProfile).toHaveBeenCalledWith('u1', expect.any(Object));
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid body', async () => {
		const req = { body: { firstName: 'X' } } as unknown as Request;
		const res = makeRes({ userId: 'u1' });
		const next = vi.fn();
		await updateMyProfileController(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
