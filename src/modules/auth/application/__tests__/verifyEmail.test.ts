import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { verifyEmail } from '@Modules/auth/application/verifyEmail';
import { InvalidTokenError } from '@Modules/auth/domain/errors/AuthErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyEmail: vi.fn() },
}));

vi.mock('@Modules/notifications-email', () => ({
	sendEmail: vi.fn().mockResolvedValue(undefined),
	welcomeEmailTemplate: vi.fn().mockReturnValue({ subject: 'Welcome', html: '<p/>' }),
}));

const seedUser = (overrides = {}) =>
	UserModel.create({
		email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'hashed',
		firstName: 'John',
		lastName: 'Doe',
		isEmailVerified: false,
		...overrides,
	});

describe('verifyEmail', () => {
	it('sets isEmailVerified to true in the database', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser();

		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: user.id,
			type: 'email_verification',
		});

		await verifyEmail('valid-token');

		const updated = await UserModel.findOne({ id: user.id });
		expect(updated!.isEmailVerified).toBe(true);
	});

	it('returns user id and email', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser();

		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: user.id,
			type: 'email_verification',
		});

		const result = await verifyEmail('valid-token');

		expect(result.id).toBe(user.id);
		expect(result.email).toBe(user.email);
	});

	it('throws InvalidTokenError when the JWT is invalid', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyEmail).mockImplementation(() => {
			throw new Error('bad jwt');
		});

		await expect(verifyEmail('bad-token')).rejects.toBeInstanceOf(InvalidTokenError);
	});

	it('throws InvalidTokenError when token type is not email_verification', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'u1',
			type: 'password_reset',
		});

		await expect(verifyEmail('wrong-type-token')).rejects.toBeInstanceOf(InvalidTokenError);
	});

	it('throws UserNotFoundError when user is already verified or does not exist', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser({ isEmailVerified: true });

		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: user.id,
			type: 'email_verification',
		});

		await expect(verifyEmail('already-verified-token')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
