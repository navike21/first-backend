import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/users/application/listUsers', () => ({ listUsers: vi.fn() }));

import { listUsersController } from '@Modules/users/controllers/user.list';
import { listUsers } from '@Modules/users/application/listUsers';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('listUsersController', () => {
  it('calls listUsers with valid query params', async () => {
    vi.mocked(listUsers).mockResolvedValue([] as never);
    const req = { query: { page: '1', limit: '10' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await listUsersController(req, res, next);
    expect(listUsers).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error on invalid query', async () => {
    const req = { query: { page: '0' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await listUsersController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
