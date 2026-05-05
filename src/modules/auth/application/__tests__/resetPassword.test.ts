import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { resetPassword } from '@Modules/auth/application/resetPassword';
import {
	InvalidTokenError,
	UserNotFoundError,
} from '@Modules/auth/domain/errors/AuthErrors';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { UserModel } from '@Modules/users';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyEmail: vi.fn() },
}));

vi.mock('@Modules/users', () => ({
	UserModel: { findOne: vi.fn(), findOneAndUpdate: vi.fn() },
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { hash: vi.fn().mockResolvedValue('new-hashed') },
}));

vi.mock('@Modules/auth/infrastructure/RefreshTokenModel', () => ({
	default: { updateMany: vi.fn() },
}));

vi.mock('@Modules/auth/infrastructure/SessionModel', () => ({
	default: { deleteMany: vi.fn() },
}));

type MockUser = Pick<UserDocument, 'id'>;

describe('resetPassword', () => {
	it('resets the password and revokes all sessions when token is valid', async () => {
		// Arrange
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'u1',
			type: 'password_reset',
		});
		const mockUser: MockUser = { id: 'u1' };
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(UserModel.findOneAndUpdate).mockResolvedValue(null);
		vi.mocked(RefreshTokenModel.updateMany).mockResolvedValue(
			undefined as never,
		);
		vi.mocked(SessionModel.deleteMany).mockResolvedValue(undefined as never);

		// Act
		await resetPassword('valid-token', 'newpass');

		// Assert
		expect(HashedPassword.hash).toHaveBeenCalledWith('newpass');
		expect(UserModel.findOneAndUpdate).toHaveBeenCalled();
		expect(SessionModel.deleteMany).toHaveBeenCalledWith({ userId: 'u1' });
	});

	it('throws InvalidTokenError when the JWT is invalid', async () => {
		// Arrange
		vi.mocked(JwtService.verifyEmail).mockImplementation(() => {
			throw new Error('bad');
		});

		// Act & Assert
		await expect(resetPassword('bad-token', 'pass')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});

	it('throws InvalidTokenError when the token type is not password_reset', async () => {
		// Arrange
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'u1',
			type: 'email_verification',
		});

		// Act & Assert
		await expect(resetPassword('wrong-type', 'pass')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});

	it('throws UserNotFoundError when the user is not found', async () => {
		// Arrange
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'u1',
			type: 'password_reset',
		});
		vi.mocked(UserModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(resetPassword('valid-token', 'pass')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
