import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/auth/application/getActiveSessions', () => ({ getActiveSessions: vi.fn() }));

import { authGetSessions } from '@Modules/auth/controllers/auth.sessions';
import { getActiveSessions } from '@Modules/auth/application/getActiveSessions';
import { successResponse } from '@Helpers/responseStructure';

function makeRes(locals: Record<string, unknown> = {}) {
  return { locals, status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('authGetSessions', () => {
  it('returns active sessions for the current user', async () => {
    vi.mocked(getActiveSessions).mockResolvedValue([] as never);
    const req = {} as unknown as Request;
    const res = makeRes({ userId: 'user-123' });
    const next = vi.fn();
    await authGetSessions(req, res, next);
    expect(getActiveSessions).toHaveBeenCalledWith('user-123');
    expect(successResponse).toHaveBeenCalled();
  });
});
