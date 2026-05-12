import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';
import { logoutUser } from '@Modules/auth/application/logoutUser';

withMongo();

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyRefresh: vi.fn() },
}));

vi.mock('@Shared/infrastructure/SocketServer', () => ({
	emitSessionUpdate: vi.fn(),
}));

const seedRT = (overrides = {}) =>
	RefreshTokenModel.create({
		jti: `jti-${crypto.randomUUID().slice(0, 8)}`,
		userId: `u-${crypto.randomUUID().slice(0, 8)}`,
		expiresAt: new Date(Date.now() + 86400000),
		...overrides,
	});

describe('logoutUser', () => {
	it('revokes the RefreshToken and deletes the Session', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const rt = await seedRT();
		await SessionModel.create({ userId: rt.userId, userAgent: 'ua', ip: '1.1.1.1' });

		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: rt.userId,
			jti: rt.jti,
			type: 'refresh',
		});

		await logoutUser('valid-token');

		const updated = await RefreshTokenModel.findOne({ jti: rt.jti });
		expect(updated!.revokedAt).toBeInstanceOf(Date);

		const session = await SessionModel.findOne({ userId: rt.userId });
		expect(session).toBeNull();
	});

	it('does nothing when the RefreshToken is already revoked', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		const rt = await seedRT({ revokedAt: new Date(Date.now() - 1000) });

		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: rt.userId,
			jti: rt.jti,
			type: 'refresh',
		});

		await logoutUser('already-revoked');

		const unchanged = await RefreshTokenModel.findOne({ jti: rt.jti });
		expect(unchanged!.revokedAt).toBeDefined();
	});

	it('resolves without throwing when the JWT is invalid', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyRefresh).mockImplementation(() => {
			throw new Error('bad jwt');
		});

		await expect(logoutUser('bad-token')).resolves.toBeUndefined();
	});

	it('resolves without throwing when the RefreshToken is not in the database', async () => {
		const { JwtService } = await import('@Shared/infrastructure/JwtService');
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'nonexistent-jti',
			type: 'refresh',
		});

		await expect(logoutUser('token')).resolves.toBeUndefined();
	});
});
