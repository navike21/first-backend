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
vi.mock('@Modules/user-groups/application/createUserGroup', () => ({ createUserGroup: vi.fn() }));
vi.mock('@Modules/user-groups/application/listUserGroups', () => ({ listUserGroups: vi.fn() }));
vi.mock('@Modules/user-groups/application/getUserGroupById', () => ({ getUserGroupById: vi.fn() }));
vi.mock('@Modules/user-groups/application/updateUserGroup', () => ({ updateUserGroup: vi.fn() }));
vi.mock('@Modules/user-groups/application/deleteUserGroup', () => ({ deleteUserGroup: vi.fn() }));

import { Router } from 'express';
import { userGroupsApi } from '@Modules/user-groups/routes/route';

describe('userGroupsApi route', () => {
  it('registers routes on the router', () => {
    const router = Router();
    expect(() => userGroupsApi(router)).not.toThrow();
  });
});
