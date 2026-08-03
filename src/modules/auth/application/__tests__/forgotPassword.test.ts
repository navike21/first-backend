import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { eventBus } from '@Shared/infrastructure/EventBus';
import { forgotPassword } from '@Modules/auth/application/forgotPassword';

withMongo();

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { signEmail: vi.fn().mockReturnValue('RESET_TOKEN') },
}));

vi.mock('@Constants/environments', () => ({
	ENV: { CLIENT_URL: 'http://localhost:3000' },
}));

vi.mock('@Helpers/log', () => ({ logInfo: vi.fn() }));

describe('forgotPassword', () => {
	let publishSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue();
	});
	afterEach(() => {
		publishSpy.mockRestore();
	});

	it('publishes PasswordResetRequestedEvent for an existing user', async () => {
		const user = await UserModel.create({
			email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
			password: 'hashed',
			firstName: 'John',
			lastName: 'Doe',
		});

		await forgotPassword(user.email);

		expect(publishSpy).toHaveBeenCalledTimes(1);
		const event = publishSpy.mock.calls[0][0];
		expect(event.eventName).toBe('auth.password_reset_requested');
		expect(event).toMatchObject({ email: user.email });
	});

	it('resolves silently without publishing for a non-existent user', async () => {
		await expect(forgotPassword('nobody@example.com')).resolves.toBeUndefined();
		expect(publishSpy).not.toHaveBeenCalled();
	});

	it('embeds the requested language in the reset URL', async () => {
		const user = await UserModel.create({
			email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
			password: 'hashed',
			firstName: 'Jane',
			lastName: 'Doe',
		});

		await forgotPassword(user.email, 'fr');

		const event = publishSpy.mock.calls[0][0];
		expect(event.resetUrl).toBe(
			'http://localhost:3000/fr/reset-password?token=RESET_TOKEN',
		);
	});

	it('is case-insensitive for the email lookup', async () => {
		const email = `UPPER-${crypto.randomUUID().slice(0, 8)}@test.com`;
		await UserModel.create({
			email: email.toLowerCase(),
			password: 'hashed',
			firstName: 'Al',
			lastName: 'Bo',
		});

		await forgotPassword(email);

		expect(publishSpy).toHaveBeenCalled();
	});
});
