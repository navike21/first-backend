import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/user-groups/application/listUserGroups', () => ({ listUserGroups: vi.fn() }));

import { listUserGroupsController } from '@Modules/user-groups/controllers/userGroup.list';
import { listUserGroups } from '@Modules/user-groups/application/listUserGroups';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('listUserGroupsController', () => {
  it('calls listUserGroups with valid query params', async () => {
    vi.mocked(listUserGroups).mockResolvedValue([] as never);
    const req = { query: { page: '1', limit: '10' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await listUserGroupsController(req, res, next);
    expect(listUserGroups).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error on invalid query', async () => {
    const req = { query: { page: '-1' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await listUserGroupsController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
