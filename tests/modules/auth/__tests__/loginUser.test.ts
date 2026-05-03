import { describe, it, expect, vi } from 'vitest';
import { loginUser } from '@Modules/auth/application/loginUser';
import { InvalidCredentialsError, EmailNotVerifiedError } from '@Modules/auth/domain/errors/AuthErrors';
import { UserModel } from '@Modules/users';
import { UserGroupModel } from '@Modules/user-groups';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';

// Mocks for dependencies of loginUser
vi.mock('@Modules/users', () => ({
  UserModel: {
    findOne: vi.fn()
  }
}));

vi.mock('@Modules/user-groups', () => ({
  UserGroupModel: {
    findOne: vi.fn()
  }
}));

vi.mock('@Helpers/uuid', () => ({
  default: () => 'generated-uuid'
}));

vi.mock('@Shared/infrastructure/JwtService', () => ({
  JwtService: {
    signAccess: vi.fn().mockReturnValue('ACCESS_TOKEN'),
    signRefresh: vi.fn().mockReturnValue('REFRESH_TOKEN')
  }
}));

vi.mock('@Shared/infrastructure/SocketServer', () => ({
  emitSessionUpdate: vi.fn()
}));

vi.mock('@Modules/auth/infrastructure/RefreshTokenModel', () => ({
  default: { create: vi.fn() }
}));

vi.mock('@Modules/auth/infrastructure/SessionModel', () => ({
  default: { create: vi.fn() }
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
  HashedPassword: { compare: vi.fn() }
}));

vi.mock('@Modules/auth/domain/errors/AuthErrors', () => ({
  InvalidCredentialsError: class InvalidCredentialsError extends Error {},
  EmailNotVerifiedError: class EmailNotVerifiedError extends Error {}
}));

describe('Auth loginUser', () => {
  it('logs in a valid user and returns tokens', async () => {
    UserModel.findOne.mockResolvedValue({
      id: 'u1',
      email: 'test@example.com',
      password: 'hashed',
      firstName: 'Test',
      lastName: 'User',
      groupId: 'g1',
      isEmailVerified: true
    });
    (HashedPassword as any).compare.mockResolvedValue(true);
    UserGroupModel.findOne.mockResolvedValue({ id: 'g1', permissions: ['READ', 'WRITE'] });

    const result = await loginUser({ email: 'test@example.com', password: 'password', ip: '1.2.3.4', userAgent: 'ua' });

    expect(result.accessToken).toBe('ACCESS_TOKEN');
    expect(result.refreshToken).toBe('REFRESH_TOKEN');
    expect(result.user.id).toBe('u1');
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.permissions).toEqual(['READ', 'WRITE']);
  });

  it('throws InvalidCredentialsError when password is invalid', async () => {
    UserModel.findOne.mockResolvedValue({
      id: 'u4',
      email: 'badpassword@example.com',
      password: 'hashed',
      firstName: 'Bad',
      lastName: 'Password',
      groupId: 'g1',
      isEmailVerified: true
    });
    (HashedPassword as any).compare.mockResolvedValue(false);

    await expect(
      loginUser({ email: 'badpassword@example.com', password: 'wrong', ip: '1.2.3.4', userAgent: 'ua' })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('throws InvalidCredentialsError when user not found', async () => {
    UserModel.findOne.mockResolvedValue(null);
    await expect(
      loginUser({ email: 'missing@example.com', password: 'pw', ip: '1.2.3.4', userAgent: 'ua' })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('logs in a user without a group: no permissions', async () => {
    UserModel.findOne.mockResolvedValue({
      id: 'u2',
      email: 'nogroup@example.com',
      password: 'hashed',
      firstName: 'No',
      lastName: 'Group',
      groupId: 'missing',
      isEmailVerified: true
    });
    (HashedPassword as any).compare.mockResolvedValue(true);
    UserGroupModel.findOne.mockResolvedValue(null);

    const result = await loginUser({ email: 'nogroup@example.com', password: 'password', ip: '1.2.3.4', userAgent: 'ua' });
    expect(result.user.permissions).toEqual([]);
  });

  it('logs in user without a groupId should skip group lookup', async () => {
    UserModel.findOne.mockResolvedValue({
      id: 'u5',
      email: 'nogroupid@example.com',
      password: 'hashed',
      firstName: 'No',
      lastName: 'GroupId',
      // no groupId
      isEmailVerified: true
    });
    (HashedPassword as any).compare.mockResolvedValue(true);
    // ensure no group lookup is performed
    UserGroupModel.findOne.mockResolvedValue(null);

    const result = await loginUser({ email: 'nogroupid@example.com', password: 'password', ip: '1.2.3.4', userAgent: 'ua' });
    expect(result.user.permissions).toEqual([]);
  });

  it('throws EmailNotVerifiedError when user email not verified', async () => {
    UserModel.findOne.mockResolvedValue({
      id: 'u3',
      email: 'notverified@example.com',
      password: 'hashed',
      firstName: 'Not',
      lastName: 'Verified',
      groupId: 'g1',
      isEmailVerified: false
    });
    (HashedPassword as any).compare.mockResolvedValue(true);
    UserGroupModel.findOne.mockResolvedValue({ id: 'g1', permissions: ['READ'] });

    await expect(
      loginUser({ email: 'notverified@example.com', password: 'password', ip: '1.2.3.4', userAgent: 'ua' })
    ).rejects.toBeInstanceOf(EmailNotVerifiedError);
  });
});
