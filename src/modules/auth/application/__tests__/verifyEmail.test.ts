import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { verifyEmail } from '@Modules/auth/application/verifyEmail';
import { InvalidTokenError } from '@Modules/auth/domain/errors/AuthErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { UserModel } from '@Modules/users';

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyEmail: vi.fn() },
}));

vi.mock('@Modules/users', () => ({
	UserModel: { findOneAndUpdate: vi.fn() },
}));

vi.mock('@Modules/notifications-email', () => ({
	sendEmail: vi.fn(),
	welcomeEmailTemplate: vi
		.fn()
		.mockReturnValue({ subject: 'Welcome', html: '<p>Welcome</p>' }),
}));

type MockUser = Pick<UserDocument, 'id' | 'email' | 'firstName'>;

describe('verifyEmail', () => {
	it('verifies the email and returns user data', async () => {
		// Arrange
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'u1',
			type: 'email_verification',
		});
		const mockUser: MockUser = { id: 'u1', email: 'a@b.c', firstName: 'Alice' };
		vi.mocked(UserModel.findOneAndUpdate).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);

		// Act
		const result = await verifyEmail('valid-token');

		// Assert
		expect(result).toEqual({ id: 'u1', email: 'a@b.c' });
	});

	it('throws InvalidTokenError when the JWT is invalid', async () => {
		// Arrange
		vi.mocked(JwtService.verifyEmail).mockImplementation(() => {
			throw new Error('bad');
		});

		// Act & Assert
		await expect(verifyEmail('bad-token')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});

	it('throws InvalidTokenError when the token type is not email_verification', async () => {
		// Arrange
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'u1',
			type: 'password_reset',
		});

		// Act & Assert
		await expect(verifyEmail('wrong-type-token')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});

	it('throws UserNotFoundError when no user is updated', async () => {
		// Arrange
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'u1',
			type: 'email_verification',
		});
		vi.mocked(UserModel.findOneAndUpdate).mockResolvedValue(null);

		// Act & Assert
		await expect(verifyEmail('valid-token')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
