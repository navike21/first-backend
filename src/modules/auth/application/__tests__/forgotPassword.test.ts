import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { forgotPassword } from '@Modules/auth/application/forgotPassword';
import { UserModel } from '@Modules/users';
import { JwtService } from '@Shared/infrastructure/JwtService';

vi.mock('@Constants/environments', () => ({
	ENV: { CLIENT_URL: 'http://client.test' },
}));

vi.mock('@Modules/users', () => ({
	UserModel: { findOne: vi.fn() },
}));

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { signEmail: vi.fn().mockReturnValue('RESET_TOKEN') },
}));

vi.mock('@Modules/notifications', () => ({
	sendEmail: vi.fn(),
	passwordResetTemplate: vi
		.fn()
		.mockReturnValue({ subject: 'Reset', html: '<p>Reset</p>' }),
}));

vi.mock('@Helpers/log', () => ({
	logInfo: vi.fn(),
}));

import { sendEmail } from '@Modules/notifications';

type MockUser = Pick<UserDocument, 'id' | 'email' | 'firstName'>;

describe('forgotPassword', () => {
	it('sends a password reset email when the user exists', async () => {
		// Arrange
		const mockUser: MockUser = {
			id: 'u1',
			email: 'user@example.com',
			firstName: 'Alice',
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);

		// Act
		await forgotPassword('user@example.com');

		// Assert
		expect(JwtService.signEmail).toHaveBeenCalledWith({
			sub: 'u1',
			type: 'password_reset',
		});
		expect(sendEmail).toHaveBeenCalledWith(
			expect.objectContaining({ to: 'user@example.com' }),
		);
	});

	it('returns without throwing when the user does not exist', async () => {
		// Arrange
		vi.mocked(UserModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(
			forgotPassword('unknown@example.com'),
		).resolves.toBeUndefined();
		expect(sendEmail).not.toHaveBeenCalled();
	});
});
