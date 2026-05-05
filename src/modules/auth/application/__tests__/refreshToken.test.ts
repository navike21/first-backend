import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import type { UserGroupDocument } from '@Modules/user-groups';
import type { RefreshTokenDocument } from '@Modules/auth/infrastructure/RefreshTokenModel';
import { rotateRefreshToken } from '@Modules/auth/application/refreshToken';
import {
	InvalidTokenError,
	TokenReuseDetectedError,
} from '@Modules/auth/domain/errors/AuthErrors';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { UserModel } from '@Modules/users';
import { UserGroupModel } from '@Modules/user-groups';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: {
		verifyRefresh: vi.fn(),
		signAccess: vi.fn().mockReturnValue('NEW_ACCESS'),
		signRefresh: vi.fn().mockReturnValue('NEW_REFRESH'),
	},
}));

vi.mock('@Modules/users', () => ({
	UserModel: { findOne: vi.fn() },
}));

vi.mock('@Modules/user-groups', () => ({
	UserGroupModel: { findOne: vi.fn() },
}));

vi.mock('@Modules/auth/infrastructure/RefreshTokenModel', () => ({
	default: {
		findOne: vi.fn(),
		findOneAndUpdate: vi.fn(),
		updateMany: vi.fn(),
		create: vi.fn(),
	},
}));

vi.mock('@Helpers/uuid', () => ({
	default: () => 'new-jti',
}));

type MockRefreshToken = Pick<RefreshTokenDocument, 'jti' | 'userId'> & {
	revokedAt?: Date;
};
type MockUser = Pick<
	UserDocument,
	'id' | 'email' | 'firstName' | 'lastName'
> & { groupId?: string };

describe('rotateRefreshToken', () => {
	it('returns new tokens when the refresh token is valid and not revoked', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-1',
			type: 'refresh',
		});
		const storedToken: MockRefreshToken = { jti: 'jti-1', userId: 'u1' };
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(
			storedToken as unknown as HydratedDocument<RefreshTokenDocument>,
		);
		const mockUser: MockUser = {
			id: 'u1',
			email: 'a@b.c',
			firstName: 'A',
			lastName: 'B',
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(null);
		vi.mocked(RefreshTokenModel.findOneAndUpdate).mockResolvedValue(null);
		vi.mocked(RefreshTokenModel.create).mockResolvedValue(undefined as never);

		// Act
		const result = await rotateRefreshToken('valid-token', 'ua', '1.2.3.4');

		// Assert
		expect(result.accessToken).toBe('NEW_ACCESS');
		expect(result.refreshToken).toBe('NEW_REFRESH');
		expect(result.refreshExpiresMs).toBeGreaterThan(0);
	});

	it('throws InvalidTokenError when the JWT is invalid', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockImplementation(() => {
			throw new Error('bad');
		});

		// Act & Assert
		await expect(
			rotateRefreshToken('bad-token', 'ua', 'ip'),
		).rejects.toBeInstanceOf(InvalidTokenError);
	});

	it('throws InvalidTokenError when the stored token is not found', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-x',
			type: 'refresh',
		});
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(
			rotateRefreshToken('token', 'ua', 'ip'),
		).rejects.toBeInstanceOf(InvalidTokenError);
	});

	it('throws TokenReuseDetectedError and revokes all tokens when the stored token is already revoked', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-1',
			type: 'refresh',
		});
		const storedToken: MockRefreshToken = {
			jti: 'jti-1',
			userId: 'u1',
			revokedAt: new Date(),
		};
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(
			storedToken as unknown as HydratedDocument<RefreshTokenDocument>,
		);
		vi.mocked(RefreshTokenModel.updateMany).mockResolvedValue(
			undefined as never,
		);

		// Act & Assert
		await expect(
			rotateRefreshToken('token', 'ua', 'ip'),
		).rejects.toBeInstanceOf(TokenReuseDetectedError);
		expect(RefreshTokenModel.updateMany).toHaveBeenCalled();
	});

	it('throws InvalidTokenError when the user is not found', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-2',
			type: 'refresh',
		});
		const storedToken: MockRefreshToken = { jti: 'jti-2', userId: 'u1' };
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(
			storedToken as unknown as HydratedDocument<RefreshTokenDocument>,
		);
		vi.mocked(UserModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(
			rotateRefreshToken('token', 'ua', 'ip'),
		).rejects.toBeInstanceOf(InvalidTokenError);
	});

	it('returns empty permissions when user has a groupId but group is not found', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-4',
			type: 'refresh',
		});
		const storedToken: MockRefreshToken = { jti: 'jti-4', userId: 'u1' };
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(
			storedToken as unknown as HydratedDocument<RefreshTokenDocument>,
		);
		const mockUser: MockUser = {
			id: 'u1',
			email: 'a@b.c',
			firstName: 'A',
			lastName: 'B',
			groupId: 'missing',
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(null);
		vi.mocked(RefreshTokenModel.findOneAndUpdate).mockResolvedValue(null);
		vi.mocked(RefreshTokenModel.create).mockResolvedValue(undefined as never);

		// Act
		const result = await rotateRefreshToken('valid-token', 'ua', '1.2.3.4');

		// Assert
		expect(JwtService.signAccess).toHaveBeenCalledWith(
			expect.objectContaining({ permissions: [] }),
		);
		expect(result.accessToken).toBe('NEW_ACCESS');
	});

	it('includes group permissions when the user has a groupId', async () => {
		// Arrange
		vi.mocked(JwtService.verifyRefresh).mockReturnValue({
			sub: 'u1',
			jti: 'jti-3',
			type: 'refresh',
		});
		const storedToken: MockRefreshToken = { jti: 'jti-3', userId: 'u1' };
		vi.mocked(RefreshTokenModel.findOne).mockResolvedValue(
			storedToken as unknown as HydratedDocument<RefreshTokenDocument>,
		);
		const mockUser: MockUser = {
			id: 'u1',
			email: 'a@b.c',
			firstName: 'A',
			lastName: 'B',
			groupId: 'g1',
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(UserGroupModel.findOne).mockResolvedValue({
			id: 'g1',
			permissions: ['users:read'],
		} as unknown as HydratedDocument<UserGroupDocument>);
		vi.mocked(RefreshTokenModel.findOneAndUpdate).mockResolvedValue(null);
		vi.mocked(RefreshTokenModel.create).mockResolvedValue(undefined as never);

		// Act
		const result = await rotateRefreshToken('valid-token', 'ua', '1.2.3.4');

		// Assert
		expect(JwtService.signAccess).toHaveBeenCalledWith(
			expect.objectContaining({ permissions: ['users:read'] }),
		);
		expect(result.accessToken).toBe('NEW_ACCESS');
	});
});
