import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/auth/application/refreshToken', () => ({ rotateRefreshToken: vi.fn() }));

import { authRefresh } from '@Modules/auth/controllers/auth.refresh';
import { rotateRefreshToken } from '@Modules/auth/application/refreshToken';
import { successResponse } from '@Helpers/responseStructure';

function makeRes() {
  return { locals: {}, cookie: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('authRefresh', () => {
  it('rotates refresh token using x-forwarded-for header', async () => {
    vi.mocked(rotateRefreshToken).mockResolvedValue({
      accessToken: 'newAcc', refreshToken: 'newRef', refreshExpiresMs: 3600000,
    } as never);
    const req = {
      cookies: { refreshToken: 'oldref' },
      headers: { 'x-forwarded-for': '10.0.0.1', 'user-agent': 'test-agent' },
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authRefresh(req, res, next);
    expect(rotateRefreshToken).toHaveBeenCalledWith('oldref', '10.0.0.1', 'test-agent');
    expect(res.cookie).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalled();
  });

  it('falls back to socket.remoteAddress when no x-forwarded-for', async () => {
    vi.mocked(rotateRefreshToken).mockResolvedValue({
      accessToken: 'newAcc', refreshToken: 'newRef', refreshExpiresMs: 3600000,
    } as never);
    const req = {
      cookies: { refreshToken: 'oldref' },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authRefresh(req, res, next);
    expect(rotateRefreshToken).toHaveBeenCalledWith('oldref', '127.0.0.1', '');
    expect(successResponse).toHaveBeenCalled();
  });

  it('falls back to empty string when no ip available', async () => {
    vi.mocked(rotateRefreshToken).mockResolvedValue({
      accessToken: 'newAcc', refreshToken: 'newRef', refreshExpiresMs: 3600000,
    } as never);
    const req = {
      cookies: { refreshToken: 'oldref' },
      headers: {},
      socket: {},
    } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authRefresh(req, res, next);
    expect(rotateRefreshToken).toHaveBeenCalledWith('oldref', '', '');
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error when no refreshToken cookie', async () => {
    const req = { cookies: {}, headers: {}, socket: {} } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();
    await authRefresh(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
