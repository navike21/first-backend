import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/auth/application/resetPassword', () => ({ resetPassword: vi.fn() }));

import { authResetPassword } from '@Modules/auth/controllers/auth.resetPassword';
import { resetPassword } from '@Modules/auth/application/resetPassword';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('authResetPassword', () => {
  it('calls resetPassword on valid token and body', async () => {
    vi.mocked(resetPassword).mockResolvedValue(undefined as never);
    const req = { params: { token: 'validtoken' }, body: { password: 'NewPass1' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authResetPassword(req, res, next);
    expect(resetPassword).toHaveBeenCalledWith('validtoken', 'NewPass1');
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error on missing token', async () => {
    const req = { params: { token: '' }, body: { password: 'NewPass1' } } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authResetPassword(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('calls next with error on invalid body', async () => {
    const req = { params: { token: 'validtoken' }, body: {} } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authResetPassword(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
