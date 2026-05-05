import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/auth/application/verifyEmail', () => ({ verifyEmail: vi.fn() }));

import { authVerifyEmail } from '@Modules/auth/controllers/auth.verifyEmail';
import { verifyEmail } from '@Modules/auth/application/verifyEmail';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('authVerifyEmail', () => {
  it('calls verifyEmail with token from params', async () => {
    vi.mocked(verifyEmail).mockResolvedValue({ email: 'a@b.com' } as never);
    const req = { params: { token: 'mytoken' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authVerifyEmail(req, res, next);
    expect(verifyEmail).toHaveBeenCalledWith('mytoken');
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error on missing token', async () => {
    const req = { params: { token: '' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authVerifyEmail(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
