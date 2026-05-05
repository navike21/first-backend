import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

vi.mock('@Constants/environments', () => ({
  ENV: { NODE_ENV: 'test' },
  ENVIRONMENT: 'test',
}));

vi.mock('@Helpers/responseStructure', () => ({
  successResponse: vi.fn(),
  errorResponse: vi.fn(),
}));

vi.mock('@Modules/auth/application/changePassword', () => ({
  changePassword: vi.fn(),
}));

import { authChangePassword } from '@Modules/auth/controllers/auth.changePassword';
import { changePassword } from '@Modules/auth/application/changePassword';
import { successResponse } from '@Helpers/responseStructure';

function makeRes(locals: Record<string, unknown> = {}) {
  return {
    locals,
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

describe('authChangePassword', () => {
  it('calls changePassword on valid input', async () => {
    vi.mocked(changePassword).mockResolvedValue(undefined as never);
    const req = {
      body: { currentPassword: 'OldPass1', newPassword: 'NewPass2' },
    } as unknown as Request;
    const res = makeRes({ userId: 'user-123' });
    const next = vi.fn();

    await authChangePassword(req, res, next);

    expect(changePassword).toHaveBeenCalledWith({
      userId: 'user-123',
      currentPassword: 'OldPass1',
      newPassword: 'NewPass2',
    });
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error on invalid body', async () => {
    const req = { body: {} } as unknown as Request;
    const res = makeRes({ userId: 'user-123' });
    const next = vi.fn();

    await authChangePassword(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
