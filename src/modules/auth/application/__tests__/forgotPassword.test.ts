import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { forgotPassword } from '@Modules/auth/application/forgotPassword';

withMongo();

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { signEmail: vi.fn().mockReturnValue('RESET_TOKEN') },
}));

vi.mock('@Modules/notifications-email', () => ({
	sendEmail: vi.fn().mockResolvedValue(undefined),
	passwordResetTemplate: vi.fn().mockReturnValue({ subject: 'Reset', html: '<p/>' }),
}));

vi.mock('@Constants/environments', () => ({
	ENV: { CLIENT_URL: 'http://localhost:3000' },
}));

vi.mock('@Helpers/log', () => ({ logInfo: vi.fn() }));

describe('forgotPassword', () => {
	it('sends a password reset email for an existing user', async () => {
		const { sendEmail } = await import('@Modules/notifications-email');
		const user = await UserModel.create({
			email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
			password: 'hashed',
			firstName: 'John',
			lastName: 'Doe',
		});

		await forgotPassword(user.email);

		expect(sendEmail).toHaveBeenCalledWith(
			expect.objectContaining({ to: user.email }),
		);
	});

	it('resolves silently without sending email for a non-existent user', async () => {
		const { sendEmail } = await import('@Modules/notifications-email');
		vi.mocked(sendEmail).mockClear();

		await expect(forgotPassword('nobody@example.com')).resolves.toBeUndefined();
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it('is case-insensitive for the email lookup', async () => {
		const { sendEmail } = await import('@Modules/notifications-email');
		const email = `UPPER-${crypto.randomUUID().slice(0, 8)}@test.com`;
		await UserModel.create({
			email: email.toLowerCase(),
			password: 'hashed',
			firstName: 'Al',
			lastName: 'Bo',
		});

		await forgotPassword(email);

		expect(sendEmail).toHaveBeenCalled();
	});
});
