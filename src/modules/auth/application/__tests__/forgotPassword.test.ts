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

vi.mock('@Modules/notifications-email', () => ({
	sendEmail: vi.fn(),
	passwordResetTemplate: vi
		.fn()
		.mockReturnValue({ subject: 'Reset', html: '<p>Reset</p>' }),
}));

vi.mock('@Helpers/log', () => ({
	logInfo: vi.fn(),
}));

import { sendEmail, passwordResetTemplate } from '@Modules/notifications-email';

type MockUser = Pick<UserDocument, 'id' | 'email' | 'firstName'>;

describe('forgotPassword', () => {
	it('sends a password reset email when the user exists', async () => {
		const mockUser: MockUser = {
			id: 'u1',
			email: 'user@example.com',
			firstName: 'Alice',
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);

		await forgotPassword('user@example.com', 'en');

		expect(JwtService.signEmail).toHaveBeenCalledWith({
			sub: 'u1',
			type: 'password_reset',
		});
		expect(passwordResetTemplate).toHaveBeenCalledWith(
			expect.objectContaining({ firstName: 'Alice', lang: 'en' }),
		);
		expect(sendEmail).toHaveBeenCalledWith(
			expect.objectContaining({ to: 'user@example.com' }),
		);
	});

	it('passes the provided lang to the email template', async () => {
		const mockUser: MockUser = {
			id: 'u2',
			email: 'user@example.com',
			firstName: 'Bob',
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);

		await forgotPassword('user@example.com', 'es');

		expect(passwordResetTemplate).toHaveBeenCalledWith(
			expect.objectContaining({ lang: 'es' }),
		);
	});

	it('defaults to English when no lang is provided', async () => {
		const mockUser: MockUser = {
			id: 'u3',
			email: 'user@example.com',
			firstName: 'Carol',
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);

		await forgotPassword('user@example.com');

		expect(passwordResetTemplate).toHaveBeenCalledWith(
			expect.objectContaining({ lang: 'en' }),
		);
	});

	it('returns without throwing when the user does not exist', async () => {
		vi.mocked(UserModel.findOne).mockResolvedValue(null);

		await expect(
			forgotPassword('unknown@example.com'),
		).resolves.toBeUndefined();
		expect(sendEmail).not.toHaveBeenCalled();
	});
});
