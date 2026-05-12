import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';
import { changePassword } from '@Modules/auth/application/changePassword';
import { InvalidCredentialsError } from '@Modules/auth/domain/errors/AuthErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: {
		compare: vi.fn().mockResolvedValue(true),
		hash: vi.fn().mockResolvedValue('new-hashed-pw'),
	},
}));

const seedUser = (overrides = {}) =>
	UserModel.create({
		email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'old-hash',
		firstName: 'John',
		lastName: 'Doe',
		...overrides,
	});

describe('changePassword', () => {
	it('updates the password hash in the database', async () => {
		const user = await seedUser();

		await changePassword({ userId: user.id, currentPassword: 'old', newPassword: 'New1!' });

		const updated = await UserModel.findOne({ id: user.id });
		expect(updated!.password).toBe('new-hashed-pw');
	});

	it('revokes all active RefreshTokens and deletes Sessions', async () => {
		const user = await seedUser();
		await RefreshTokenModel.create({
			jti: 'active-jti',
			userId: user.id,
			expiresAt: new Date(Date.now() + 86400000),
		});
		await SessionModel.create({ userId: user.id, userAgent: 'ua', ip: '1.1.1.1' });

		await changePassword({ userId: user.id, currentPassword: 'old', newPassword: 'New1!' });

		const rt = await RefreshTokenModel.findOne({ jti: 'active-jti' });
		expect(rt!.revokedAt).toBeInstanceOf(Date);

		const session = await SessionModel.findOne({ userId: user.id });
		expect(session).toBeNull();
	});

	it('throws InvalidCredentialsError when current password is wrong', async () => {
		const { HashedPassword } = await import('@Modules/auth/domain/value-objects/HashedPassword');
		vi.mocked(HashedPassword.compare).mockResolvedValueOnce(false);
		const user = await seedUser();

		await expect(
			changePassword({ userId: user.id, currentPassword: 'wrong', newPassword: 'New1!' }),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		await expect(
			changePassword({ userId: 'nonexistent', currentPassword: 'any', newPassword: 'New1!' }),
		).rejects.toBeInstanceOf(UserNotFoundError);
	});
});
