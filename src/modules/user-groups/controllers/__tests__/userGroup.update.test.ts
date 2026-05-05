import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/user-groups/application/updateUserGroup', () => ({ updateUserGroup: vi.fn() }));

import { updateUserGroupController } from '@Modules/user-groups/controllers/userGroup.update';
import { updateUserGroup } from '@Modules/user-groups/application/updateUserGroup';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('updateUserGroupController', () => {
  it('calls updateUserGroup on valid input', async () => {
    vi.mocked(updateUserGroup).mockResolvedValue({ id: 'group-1', name: 'Updated' } as never);
    const req = { params: { id: 'group-1' }, body: { name: 'Updated' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await updateUserGroupController(req, res, next);
    expect(updateUserGroup).toHaveBeenCalledWith('group-1', expect.any(Object));
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error on invalid body', async () => {
    const req = { params: { id: 'group-1' }, body: { name: 'X' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await updateUserGroupController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
