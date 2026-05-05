import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/auth/application/loginUser', () => ({ loginUser: vi.fn() }));

import { authLogin } from '@Modules/auth/controllers/auth.login';
import { loginUser } from '@Modules/auth/application/loginUser';
import { successResponse } from '@Helpers/responseStructure';

function makeRes(locals: Record<string, unknown> = {}) {
  return {
    locals,
    cookie: vi.fn(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

describe('authLogin', () => {
  it('calls loginUser and sets cookie on valid input', async () => {
    vi.mocked(loginUser).mockResolvedValue({
      accessToken: 'acc', refreshToken: 'ref', refreshExpiresMs: 3600000, user: {},
    } as never);
    const req = {
      body: { email: 'a@b.com', password: 'Password1' },
      headers: { 'x-forwarded-for': '10.0.0.1', 'user-agent': 'test-agent' },
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();

    await authLogin(req, res, next);

    expect(loginUser).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'ref', expect.any(Object));
    expect(successResponse).toHaveBeenCalled();
  });

  it('falls back to socket.remoteAddress when no x-forwarded-for', async () => {
    vi.mocked(loginUser).mockResolvedValue({
      accessToken: 'acc', refreshToken: 'ref', refreshExpiresMs: 3600000, user: {},
    } as never);
    const req = {
      body: { email: 'a@b.com', password: 'Password1' },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();

    await authLogin(req, res, next);

    expect(loginUser).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalled();
  });

  it('calls next with error on invalid body', async () => {
    const req = { body: {}, headers: {}, socket: {} } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();

    await authLogin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('uses empty string ip when both x-forwarded-for and remoteAddress are absent', async () => {
    vi.mocked(loginUser).mockResolvedValue({
      accessToken: 'acc', refreshToken: 'ref', refreshExpiresMs: 3600000, user: {},
    } as never);
    const req = {
      body: { email: 'a@b.com', password: 'Password1' },
      headers: {},
      socket: {},
    } as unknown as Request;
    const res = makeRes();
    const next = vi.fn();

    await authLogin(req, res, next);

    expect(loginUser).toHaveBeenCalled();
  });
});
