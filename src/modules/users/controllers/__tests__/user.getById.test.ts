import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/users/application/getUserById', () => ({ getUserById: vi.fn() }));

import { getUserByIdController } from '@Modules/users/controllers/user.getById';
import { getUserById } from '@Modules/users/application/getUserById';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('getUserByIdController', () => {
  it('calls getUserById with id param', async () => {
    vi.mocked(getUserById).mockResolvedValue({ id: 'u1' } as never);
    const req = { params: { id: 'u1' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await getUserByIdController(req, res, next);
    expect(getUserById).toHaveBeenCalledWith('u1');
    expect(successResponse).toHaveBeenCalled();
  });
});
