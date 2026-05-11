import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import type { UserGroupDocument } from '@Modules/user-groups';
import { loginUser } from '@Modules/auth/application/loginUser';
import {
	InvalidCredentialsError,
	EmailNotVerifiedError,
} from '@Modules/auth/domain/errors/AuthErrors';
import { UserModel } from '@Modules/users';
import { UserGroupModel } from '@Modules/user-groups';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';

vi.mock('@Modules/users', () => ({
	UserModel: { findOne: vi.fn() },
}));

vi.mock('@Modules/user-groups', () => ({
	UserGroupModel: { findOne: vi.fn() },
}));

vi.mock('@Helpers/uuid', () => ({
	default: () => 'generated-uuid',
}));

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: {
		signAccess: vi.fn().mockReturnValue('ACCESS_TOKEN'),
		signRefresh: vi.fn().mockReturnValue('REFRESH_TOKEN'),
	},
}));

vi.mock('@Shared/infrastructure/SocketServer', () => ({
	emitSessionUpdate: vi.fn(),
}));

vi.mock('@Modules/auth/infrastructure/RefreshTokenModel', () => ({
	default: { create: vi.fn() },
}));

vi.mock('@Modules/auth/infrastructure/SessionModel', () => ({
	default: { create: vi.fn() },
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { compare: vi.fn() },
}));

type MockUser = Pick<
	UserDocument,
	'id' | 'email' | 'password' | 'firstName' | 'lastName' | 'isEmailVerified'
> & { groupId?: string };

describe('Auth loginUser', () => {
	it('logs in a valid user and returns tokens and user data', async () => {
		// Arrange
		const mockUser: MockUser = {
			id: 'u1',
			email: 'test@example.com',
			password: 'hashed',
			firstName: 'Test',
			lastName: 'User',
			groupId: 'g1',
			isEmailVerified: true,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(HashedPassword.compare).mockResolvedValue(true);
		vi.mocked(UserGroupModel.findOne).mockResolvedValue({
			id: 'g1',
			permissions: ['READ', 'WRITE'],
		} as unknown as HydratedDocument<UserGroupDocument>);

		// Act
		const result = await loginUser({
			email: 'test@example.com',
			password: 'password',
			ip: '1.2.3.4',
			userAgent: 'ua',
		});

		// Assert
		expect(result.accessToken).toBe('ACCESS_TOKEN');
		expect(result.refreshToken).toBe('REFRESH_TOKEN');
		expect(result.user.id).toBe('u1');
		expect(result.user.email).toBe('test@example.com');
		expect(result.user.permissions).toEqual(['READ', 'WRITE']);
	});

	it('throws InvalidCredentialsError when the user is not found', async () => {
		// Arrange
		vi.mocked(UserModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(
			loginUser({
				email: 'missing@example.com',
				password: 'pw',
				ip: '1.2.3.4',
				userAgent: 'ua',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('throws InvalidCredentialsError when the password does not match', async () => {
		// Arrange
		const mockUser: MockUser = {
			id: 'u4',
			email: 'badpassword@example.com',
			password: 'hashed',
			firstName: 'Bad',
			lastName: 'Password',
			isEmailVerified: true,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(HashedPassword.compare).mockResolvedValue(false);

		// Act & Assert
		await expect(
			loginUser({
				email: 'badpassword@example.com',
				password: 'wrong',
				ip: '1.2.3.4',
				userAgent: 'ua',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('throws EmailNotVerifiedError when the user email is not verified', async () => {
		// Arrange
		const mockUser: MockUser = {
			id: 'u3',
			email: 'notverified@example.com',
			password: 'hashed',
			firstName: 'Not',
			lastName: 'Verified',
			groupId: 'g1',
			isEmailVerified: false,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(HashedPassword.compare).mockResolvedValue(true);

		// Act & Assert
		await expect(
			loginUser({
				email: 'notverified@example.com',
				password: 'password',
				ip: '1.2.3.4',
				userAgent: 'ua',
			}),
		).rejects.toBeInstanceOf(EmailNotVerifiedError);
	});

	it('returns empty permissions when the user has no groupId', async () => {
		// Arrange
		const mockUser: MockUser = {
			id: 'u5',
			email: 'nogroupid@example.com',
			password: 'hashed',
			firstName: 'No',
			lastName: 'GroupId',
			isEmailVerified: true,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(HashedPassword.compare).mockResolvedValue(true);

		// Act
		const result = await loginUser({
			email: 'nogroupid@example.com',
			password: 'password',
			ip: '1.2.3.4',
			userAgent: 'ua',
		});

		// Assert
		expect(result.user.permissions).toEqual([]);
		expect(UserGroupModel.findOne).not.toHaveBeenCalled();
	});

	it('returns empty permissions when the group is not found for the given groupId', async () => {
		// Arrange
		const mockUser: MockUser = {
			id: 'u2',
			email: 'nogroup@example.com',
			password: 'hashed',
			firstName: 'No',
			lastName: 'Group',
			groupId: 'missing',
			isEmailVerified: true,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(HashedPassword.compare).mockResolvedValue(true);
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(null);

		// Act
		const result = await loginUser({
			email: 'nogroup@example.com',
			password: 'password',
			ip: '1.2.3.4',
			userAgent: 'ua',
		});

		// Assert
		expect(result.user.permissions).toEqual([]);
	});
});
