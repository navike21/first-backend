import { describe, it, expect, vi } from 'vitest';
import { createUser } from '@Modules/users/application/createUser';
import { sendEmail, verifyEmailTemplate } from '@Modules/notifications';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { EmailAlreadyExistsError } from '@Modules/users/domain/errors/UserErrors';

// Mocks for dependencies of createUser
vi.mock('@Constants/userGender', () => ({
  USER_GENDER_ARRAY: ['MALE', 'FEMALE'],
  UserGender: {}
}));
vi.mock('@Modules/users/infrastructure/UserModel', () => ({
  default: { findOne: vi.fn(), create: vi.fn() }
}));

vi.mock('@Modules/notifications', () => ({
  sendEmail: vi.fn(),
  verifyEmailTemplate: vi.fn().mockReturnValue({ subject: 'Verify Email', text: 'Please verify' })
}));

vi.mock('@Modules/users/domain/errors/UserErrors', () => ({
  EmailAlreadyExistsError: class EmailAlreadyExistsError extends Error {}
}));

vi.mock('@Constants/environments', () => ({
  ENV: { CLIENT_URL: 'http://client.local' }
}));

vi.mock('@Modules/notifications', () => ({
  sendEmail: vi.fn(),
  verifyEmailTemplate: vi.fn().mockReturnValue({ subject: 'Verify Email', text: 'Please verify' })
}));

vi.mock('@Constants/statusRegister', () => ({
  ACTIVE: 'ACTIVE',
  STATUS_REGISTER_ARRAY: ['ACTIVE', 'INACTIVE'],
  StatusRegister: {}
}));

vi.mock('@Shared/domain/AppError', () => ({ AppError: class AppError extends Error {} }));

vi.mock('@Shared/infrastructure/JwtService', () => ({
  JwtService: {
    signEmail: vi.fn().mockReturnValue('EMAIL_TOKEN')
  }
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
  HashedPassword: { hash: vi.fn().mockResolvedValue('hashedPW') }
}));

describe('Users createUser', () => {
  const input: any = {
    email: 'new@example.com',
    password: 'Password1!',
    firstName: 'New',
    lastName: 'User'
  };

  let UserModel: any;
  beforeAll(async () => {
    const mod = await import('@Modules/users/infrastructure/UserModel');
    UserModel = mod.default;
  });
  beforeEach(() => {
    // Reset mocks before each test
    UserModel.findOne = vi.fn();
    UserModel.create = vi.fn();
    //Mocks for notifications are provided by imported identities
  });

  it('creates a new user, sends verification email and returns user data', async () => {
    UserModel.findOne.mockResolvedValue(null);
    UserModel.create.mockResolvedValue({ id: 'u123', email: input.email, firstName: input.firstName, lastName: input.lastName });

    // Use mocked notifications imported at top
    const result = await createUser(input);

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: input.email });
    expect(UserModel.create).toHaveBeenCalledWith(expect.objectContaining({
      email: input.email,
      password: 'hashedPW',
      firstName: input.firstName,
      lastName: input.lastName
    }));
    expect(JwtService.signEmail).toHaveBeenCalledWith({ sub: 'u123', type: 'email_verification' });
    const token = 'EMAIL_TOKEN';
    const expectedVerificationUrl = `http://client.local/verify-email?token=${token}`;
    expect(verifyEmailTemplate).toHaveBeenCalledWith({ firstName: input.firstName, verificationUrl: expectedVerificationUrl });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: input.email }));
    expect(result).toEqual({ id: 'u123', email: input.email, firstName: input.firstName, lastName: input.lastName });
  });

  it('throws EmailAlreadyExistsError when email already exists', async () => {
    // Use the already-initialized UserModel
    UserModel.findOne.mockResolvedValue({ id: 'existing' });
    await expect(createUser(input)).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
});
