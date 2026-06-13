import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';
import { resetPassword } from '@Modules/auth/application/resetPassword';
import { InvalidTokenError } from '@Modules/auth/domain/errors/AuthErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyEmail: vi.fn() },
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { hash: vi.fn().mockResolvedValue('new-hash') },
}));

const seedUser = () =>
	UserModel.create({
		email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'old-hash',
		firstName: 'John',
		lastName: 'Doe',
	});

describe('resetPassword', () => {
	it('updates the password in the database', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser();

		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: user.id,
			type: 'password_reset',
		});

		await resetPassword('valid-token', 'NewPass1!');

		const updated = await UserModel.findOne({ id: user.id });
		expect(updated!.password).toBe('new-hash');
	});

	it('revokes active RefreshTokens and deletes Sessions', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser();
		await RefreshTokenModel.create({
			jti: 'active-jti',
			userId: user.id,
			expiresAt: new Date(Date.now() + 86400000),
		});
		await SessionModel.create({
			userId: user.id,
			userAgent: 'ua',
			ip: '1.1.1.1',
		});

		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: user.id,
			type: 'password_reset',
		});

		await resetPassword('valid-token', 'NewPass1!');

		const rt = await RefreshTokenModel.findOne({ jti: 'active-jti' });
		expect(rt!.revokedAt).toBeInstanceOf(Date);

		const session = await SessionModel.findOne({ userId: user.id });
		expect(session).toBeNull();
	});

	it('rejects a token issued before the last password change (single-use)', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser();
		// Simulate a password already changed after the token was issued.
		await UserModel.findOneAndUpdate(
			{ id: user.id },
			{ $set: { passwordChangedAt: new Date() } },
		);

		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: user.id,
			type: 'password_reset',
			iat: Math.floor((Date.now() - 60_000) / 1000),
		});

		await expect(
			resetPassword('replayed-token', 'NewPass1!'),
		).rejects.toBeInstanceOf(InvalidTokenError);
	});

	it('throws InvalidTokenError when the JWT is invalid', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyEmail).mockImplementation(() => {
			throw new Error('bad jwt');
		});

		await expect(resetPassword('bad-token', 'any')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});

	it('throws InvalidTokenError when token type is not password_reset', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'u1',
			type: 'email_verification',
		});

		await expect(resetPassword('wrong-type', 'any')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyEmail).mockReturnValue({
			sub: 'nonexistent-user',
			type: 'password_reset',
		});

		await expect(resetPassword('valid-token', 'any')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
