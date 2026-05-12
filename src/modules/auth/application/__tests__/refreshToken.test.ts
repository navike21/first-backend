import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';
import { rotateRefreshToken } from '@Modules/auth/application/refreshToken';
import {
	InvalidTokenError,
	TokenReuseDetectedError,
} from '@Modules/auth/domain/errors/AuthErrors';

withMongo();

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: {
		verifyRefresh: vi.fn(),
		signAccess: vi.fn().mockReturnValue('NEW_ACCESS'),
		signRefresh: vi.fn().mockReturnValue('NEW_REFRESH'),
	},
}));

vi.mock('@Helpers/uuid', () => ({ default: () => 'new-jti' }));

const seedUser = () =>
	UserModel.create({
		email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'hashed',
		firstName: 'Al',
		lastName: 'Bo',
	});

const seedRT = (userId: string, overrides = {}) =>
	RefreshTokenModel.create({
		jti: `jti-${crypto.randomUUID().slice(0, 8)}`,
		userId,
		expiresAt: new Date(Date.now() + 86400000),
		...overrides,
	});

describe('rotateRefreshToken', () => {
	it('revokes the old RT and creates a new one in the database', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser();
		const rt = await seedRT(user.id);

		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: user.id,
			jti: rt.jti,
			type: 'refresh',
		});

		await rotateRefreshToken('valid-token', 'ua', '1.1.1.1');

		const old = await RefreshTokenModel.findOne({ jti: rt.jti });
		expect(old!.revokedAt).toBeInstanceOf(Date);
		expect(old!.replacedBy).toBe('new-jti');

		const newRT = await RefreshTokenModel.findOne({ jti: 'new-jti' });
		expect(newRT).not.toBeNull();
		expect(newRT!.userId).toBe(user.id);
	});

	it('returns new access and refresh tokens', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser();
		const rt = await seedRT(user.id);

		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: user.id,
			jti: rt.jti,
			type: 'refresh',
		});

		const result = await rotateRefreshToken('valid-token', 'ua', 'ip');

		expect(result.accessToken).toBe('NEW_ACCESS');
		expect(result.refreshToken).toBe('NEW_REFRESH');
	});

	it('includes group permissions in the new access token', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const group = await UserGroupModel.create({
			name: 'Admins',
			slug: 'admins',
			permissions: ['users:read'],
		});
		const user = await UserModel.create({
			email: `grp-${crypto.randomUUID().slice(0, 8)}@test.com`,
			password: 'hashed',
			firstName: 'Al',
			lastName: 'Bo',
			groupId: group.id,
		});
		const rt = await seedRT(user.id);

		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: user.id,
			jti: rt.jti,
			type: 'refresh',
		});

		await rotateRefreshToken('valid-token', 'ua', 'ip');

		expect(JwtService.signAccess).toHaveBeenCalledWith(
			expect.objectContaining({ permissions: ['users:read'] }),
		);
	});

	it('throws InvalidTokenError when the JWT is invalid', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyRefresh).mockImplementation(() => {
			throw new Error('bad');
		});

		await expect(rotateRefreshToken('bad', 'ua', 'ip')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});

	it('throws InvalidTokenError when the RefreshToken is not in the database', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'nonexistent',
			type: 'refresh',
		});

		await expect(rotateRefreshToken('token', 'ua', 'ip')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});

	it('revokes all tokens and throws TokenReuseDetectedError when the RT is already revoked', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const user = await seedUser();
		const rt = await seedRT(user.id, { revokedAt: new Date() });
		const active = await seedRT(user.id);

		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: user.id,
			jti: rt.jti,
			type: 'refresh',
		});

		await expect(
			rotateRefreshToken('reused-token', 'ua', 'ip'),
		).rejects.toBeInstanceOf(TokenReuseDetectedError);

		const revokedActive = await RefreshTokenModel.findOne({ jti: active.jti });
		expect(revokedActive!.revokedAt).toBeInstanceOf(Date);
	});

	it('throws InvalidTokenError when the user does not exist', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const rt = await RefreshTokenModel.create({
			jti: 'ghost-jti',
			userId: 'nonexistent-user',
			expiresAt: new Date(Date.now() + 86400000),
		});

		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: rt.userId,
			jti: rt.jti,
			type: 'refresh',
		});

		await expect(rotateRefreshToken('token', 'ua', 'ip')).rejects.toBeInstanceOf(
			InvalidTokenError,
		);
	});
});
