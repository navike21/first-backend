import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/user-groups/application/getUserGroupById', () => ({ getUserGroupById: vi.fn() }));

import { getUserGroupByIdController } from '@Modules/user-groups/controllers/userGroup.getById';
import { getUserGroupById } from '@Modules/user-groups/application/getUserGroupById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('getUserGroupByIdController', () => {
  it('calls getUserGroupById with id param', async () => {
    vi.mocked(getUserGroupById).mockResolvedValue({ id: 'group-1' } as never);
    const req = { params: { id: 'group-1' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await getUserGroupByIdController(req, res, next);
    expect(getUserGroupById).toHaveBeenCalledWith('group-1');
    expect(successResponse).toHaveBeenCalled();
  });
});
