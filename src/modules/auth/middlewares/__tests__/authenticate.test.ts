import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Shared/infrastructure/JwtService', () => ({
  JwtService: { verifyAccess: vi.fn() },
}));

import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { JwtService } from '@Shared/infrastructure/JwtService';

describe('authenticate', () => {
  it('calls next with error when no auth header', async () => {
    const req = { headers: {} } as Request;
    const res = { locals: {} } as unknown as Response;
    const next = vi.fn();
    await authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('calls next with error when auth header does not start with Bearer', async () => {
    const req = { headers: { authorization: 'Basic abc' } } as unknown as Request;
    const res = { locals: {} } as unknown as Response;
    const next = vi.fn();
    await authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('sets userId/permissions and calls next on valid token', async () => {
    vi.mocked(JwtService.verifyAccess).mockReturnValue({ sub: 'user1', permissions: ['users:read'] } as never);
    const req = { headers: { authorization: 'Bearer validtoken' } } as unknown as Request;
    const res = { locals: {} } as unknown as Response;
    const next = vi.fn();
    await authenticate(req, res, next);
    expect(res.locals.userId).toBe('user1');
    expect(res.locals.permissions).toEqual(['users:read']);
    expect(next).toHaveBeenCalledWith();
  });

  it('uses empty array when permissions is undefined in token', async () => {
    vi.mocked(JwtService.verifyAccess).mockReturnValue({ sub: 'user1' } as never);
    const req = { headers: { authorization: 'Bearer validtoken' } } as unknown as Request;
    const res = { locals: {} } as unknown as Response;
    const next = vi.fn();
    await authenticate(req, res, next);
    expect(res.locals.permissions).toEqual([]);
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next with error on invalid token', async () => {
    vi.mocked(JwtService.verifyAccess).mockImplementation(() => { throw new Error('invalid'); });
    const req = { headers: { authorization: 'Bearer badtoken' } } as unknown as Request;
    const res = { locals: {} } as unknown as Response;
    const next = vi.fn();
    await authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
