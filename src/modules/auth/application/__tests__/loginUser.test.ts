import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';
import { loginUser } from '@Modules/auth/application/loginUser';
import {
	InvalidCredentialsError,
	EmailNotVerifiedError,
} from '@Modules/auth/domain/errors/AuthErrors';

withMongo();

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: {
		compare: vi.fn().mockResolvedValue(true),
	},
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

vi.mock('@Helpers/uuid', () => ({ default: () => 'test-jti' }));

const seedUser = (overrides = {}) =>
	UserModel.create({
		email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'stored-hash',
		firstName: 'Test',
		lastName: 'User',
		isEmailVerified: true,
		...overrides,
	});

describe('loginUser', () => {
	it('creates a RefreshToken and Session in the database on successful login', async () => {
		const user = await seedUser();

		await loginUser({
			email: user.email,
			password: 'any',
			userAgent: 'ua',
			ip: '1.2.3.4',
		});

		const rt = await RefreshTokenModel.findOne({ userId: user.id });
		expect(rt).not.toBeNull();
		expect(rt!.jti).toBe('test-jti');

		const session = await SessionModel.findOne({ userId: user.id });
		expect(session).not.toBeNull();
		expect(session!.ip).toBe('1.2.3.4');
	});

	it('returns accessToken, refreshToken, and user data', async () => {
		const user = await seedUser();

		const result = await loginUser({
			email: user.email,
			password: 'any',
			userAgent: 'ua',
			ip: '127.0.0.1',
		});

		expect(result.accessToken).toBe('ACCESS_TOKEN');
		expect(result.refreshToken).toBe('REFRESH_TOKEN');
		expect(result.user.id).toBe(user.id);
		expect(result.user.email).toBe(user.email);
	});

	it('throws InvalidCredentialsError when user does not exist', async () => {
		await expect(
			loginUser({
				email: 'nobody@test.com',
				password: 'any',
				userAgent: 'ua',
				ip: 'ip',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('throws InvalidCredentialsError when password is wrong', async () => {
		const { HashedPassword } =
			await import('@Modules/auth/domain/value-objects/HashedPassword');
		vi.mocked(HashedPassword.compare).mockResolvedValueOnce(false);
		const user = await seedUser();

		await expect(
			loginUser({
				email: user.email,
				password: 'wrong',
				userAgent: 'ua',
				ip: 'ip',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('throws EmailNotVerifiedError when email is not verified', async () => {
		const user = await seedUser({ isEmailVerified: false });

		await expect(
			loginUser({
				email: user.email,
				password: 'any',
				userAgent: 'ua',
				ip: 'ip',
			}),
		).rejects.toBeInstanceOf(EmailNotVerifiedError);
	});
});
