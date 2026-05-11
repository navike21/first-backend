import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { RefreshTokenDocument } from '@Modules/auth/infrastructure/RefreshTokenModel';
import { logoutUser } from '@Modules/auth/application/logoutUser';
import { JwtService } from '@Shared/infrastructure/JwtService';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyRefresh: vi.fn() },
}));

vi.mock('@Shared/infrastructure/SocketServer', () => ({
	emitSessionUpdate: vi.fn(),
}));

vi.mock('@Modules/auth/infrastructure/RefreshTokenModel', () => ({
	default: { findOne: vi.fn(), findOneAndUpdate: vi.fn() },
}));

vi.mock('@Modules/auth/infrastructure/SessionModel', () => ({
	default: { deleteOne: vi.fn() },
}));

type MockToken = Pick<RefreshTokenDocument, 'jti'> & { revokedAt?: Date };

describe('logoutUser', () => {
	it('revokes the token and deletes the session when the token is valid and active', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-1',
			type: 'refresh',
		});
		const stored: MockToken = { jti: 'jti-1' };
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(
			stored as unknown as HydratedDocument<RefreshTokenDocument>,
		);
		vi.mocked(RefreshTokenModel.findOneAndUpdate).mockResolvedValue(null);
		vi.mocked(SessionModel.deleteOne).mockResolvedValue(undefined as never);

		// Act
		await logoutUser('valid-token');

		// Assert
		expect(RefreshTokenModel.findOneAndUpdate).toHaveBeenCalled();
		expect(SessionModel.deleteOne).toHaveBeenCalledWith({ userId: 'u1' });
	});

	it('does not revoke when the stored token is already revoked', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-2',
			type: 'refresh',
		});
		const stored: MockToken = { jti: 'jti-2', revokedAt: new Date() };
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(
			stored as unknown as HydratedDocument<RefreshTokenDocument>,
		);

		// Act
		await logoutUser('already-revoked-token');

		// Assert
		expect(RefreshTokenModel.findOneAndUpdate).not.toHaveBeenCalled();
		expect(SessionModel.deleteOne).not.toHaveBeenCalled();
	});

	it('does not throw when the token is invalid', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockImplementation(() => {
			throw new Error('invalid');
		});

		// Act & Assert
		await expect(logoutUser('bad-token')).resolves.toBeUndefined();
	});

	it('does nothing when the stored token is not found', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-3',
			type: 'refresh',
		});
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(null);

		// Act
		await logoutUser('unknown-token');

		// Assert
		expect(RefreshTokenModel.findOneAndUpdate).not.toHaveBeenCalled();
	});
});
