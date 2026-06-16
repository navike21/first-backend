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
vi.mock('@Modules/user-groups/application/listGroupMembers', () => ({
	listGroupMembers: vi.fn(),
}));
vi.mock('@Modules/user-groups/application/addGroupMembers', () => ({
	addGroupMembers: vi.fn(),
}));
vi.mock('@Modules/user-groups/application/removeGroupMember', () => ({
	removeGroupMember: vi.fn(),
}));

import { listGroupMembersController } from '@Modules/user-groups/controllers/userGroup.members.list';
import { addGroupMembersController } from '@Modules/user-groups/controllers/userGroup.members.add';
import { removeGroupMemberController } from '@Modules/user-groups/controllers/userGroup.members.remove';
import { listGroupMembers } from '@Modules/user-groups/application/listGroupMembers';
import { addGroupMembers } from '@Modules/user-groups/application/addGroupMembers';
import { removeGroupMember } from '@Modules/user-groups/application/removeGroupMember';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
	return {
		locals: {},
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('group members controllers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('listGroupMembersController', () => {
		it('lists members with the group id from params', async () => {
			vi.mocked(listGroupMembers).mockResolvedValue({} as never);
			const req = {
				params: { id: 'g1' },
				query: { page: '1', limit: '10' },
			} as unknown as Request;
			await listGroupMembersController(req, makeRes(), vi.fn());
			expect(listGroupMembers).toHaveBeenCalledWith('g1', expect.any(Object));
			expect(successResponse).toHaveBeenCalled();
		});

		it('forwards an error on invalid query', async () => {
			const req = {
				params: { id: 'g1' },
				query: { page: '-1' },
			} as unknown as Request;
			const next = vi.fn();
			await listGroupMembersController(req, makeRes(), next);
			expect(next).toHaveBeenCalledWith(expect.any(Error));
		});
	});

	describe('addGroupMembersController', () => {
		it('adds members with validated userIds', async () => {
			vi.mocked(addGroupMembers).mockResolvedValue({} as never);
			const req = {
				params: { id: 'g1' },
				body: { userIds: ['u1', 'u2'] },
			} as unknown as Request;
			await addGroupMembersController(req, makeRes(), vi.fn());
			expect(addGroupMembers).toHaveBeenCalledWith('g1', ['u1', 'u2']);
			expect(successResponse).toHaveBeenCalled();
		});

		it('forwards an error when userIds is empty', async () => {
			const req = {
				params: { id: 'g1' },
				body: { userIds: [] },
			} as unknown as Request;
			const next = vi.fn();
			await addGroupMembersController(req, makeRes(), next);
			expect(next).toHaveBeenCalledWith(expect.any(Error));
			expect(addGroupMembers).not.toHaveBeenCalled();
		});
	});

	describe('removeGroupMemberController', () => {
		it('removes the member identified by the route params', async () => {
			vi.mocked(removeGroupMember).mockResolvedValue({} as never);
			const req = {
				params: { id: 'g1', userId: 'u1' },
			} as unknown as Request;
			await removeGroupMemberController(req, makeRes(), vi.fn());
			expect(removeGroupMember).toHaveBeenCalledWith('g1', 'u1');
			expect(successResponse).toHaveBeenCalled();
		});
	});
});
