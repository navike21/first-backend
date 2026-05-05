import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/user-groups/application/deleteUserGroup', () => ({ deleteUserGroup: vi.fn() }));

import { deleteUserGroupController } from '@Modules/user-groups/controllers/userGroup.delete';
import { deleteUserGroup } from '@Modules/user-groups/application/deleteUserGroup';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('deleteUserGroupController', () => {
  it('calls deleteUserGroup with id param', async () => {
    vi.mocked(deleteUserGroup).mockResolvedValue(undefined as never);
    const req = { params: { id: 'group-1' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await deleteUserGroupController(req, res, next);
    expect(deleteUserGroup).toHaveBeenCalledWith('group-1');
    expect(successResponse).toHaveBeenCalled();
  });
});
