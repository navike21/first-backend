import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({ ENV: { NODE_ENV: 'test' }, ENVIRONMENT: 'test' }));
vi.mock('@Helpers/responseStructure', () => ({ successResponse: vi.fn(), errorResponse: vi.fn() }));
vi.mock('@Modules/auth/application/loginUser', () => ({ loginUser: vi.fn() }));
vi.mock('@Modules/auth/application/logoutUser', () => ({ logoutUser: vi.fn() }));
vi.mock('@Modules/auth/application/refreshToken', () => ({ rotateRefreshToken: vi.fn() }));
vi.mock('@Modules/auth/application/verifyEmail', () => ({ verifyEmail: vi.fn() }));
vi.mock('@Modules/auth/application/forgotPassword', () => ({ forgotPassword: vi.fn() }));
vi.mock('@Modules/auth/application/resetPassword', () => ({ resetPassword: vi.fn() }));
vi.mock('@Modules/auth/application/changePassword', () => ({ changePassword: vi.fn() }));
vi.mock('@Modules/auth/application/getActiveSessions', () => ({ getActiveSessions: vi.fn() }));
vi.mock('@Shared/infrastructure/JwtService', () => ({ JwtService: { verifyAccess: vi.fn() } }));
vi.mock('@Modules/users/application/createUser', () => ({ createUser: vi.fn() }));
vi.mock('@Modules/users/application/listUsers', () => ({ listUsers: vi.fn() }));
vi.mock('@Modules/users/application/getUserById', () => ({ getUserById: vi.fn() }));
vi.mock('@Modules/users/application/updateUser', () => ({ updateUser: vi.fn() }));
vi.mock('@Modules/users/application/deleteUser', () => ({ deleteUser: vi.fn() }));
vi.mock('@Modules/users/application/getMyProfile', () => ({ getMyProfile: vi.fn() }));
vi.mock('@Modules/users/application/updateMyProfile', () => ({ updateMyProfile: vi.fn() }));

import { Router } from 'express';
import { usersApi } from '@Modules/users/routes/route';

describe('usersApi route', () => {
  it('registers routes on the router', () => {
    const router = Router();
    expect(() => usersApi(router)).not.toThrow();
  });
});
