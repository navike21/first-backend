import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { changePassword } from '@Modules/auth/application/changePassword';
import { InvalidCredentialsError } from '@Modules/auth/domain/errors/AuthErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import { UserModel } from '@Modules/users';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';
import RefreshTokenModel from '@Modules/auth/infrastructure/RefreshTokenModel';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';

vi.mock('@Modules/users', () => ({
	UserModel: { findOne: vi.fn(), findOneAndUpdate: vi.fn() },
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { compare: vi.fn(), hash: vi.fn() },
}));

vi.mock('@Modules/auth/infrastructure/RefreshTokenModel', () => ({
	default: { updateMany: vi.fn() },
}));

vi.mock('@Modules/auth/infrastructure/SessionModel', () => ({
	default: { deleteMany: vi.fn() },
}));

type MockUser = Pick<UserDocument, 'id' | 'password'>;

describe('changePassword', () => {
	it('changes the password and revokes all sessions when credentials are valid', async () => {
		// Arrange
		const mockUser: MockUser = { id: 'u1', password: 'hashed' };
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(HashedPassword.compare).mockResolvedValue(true);
		vi.mocked(HashedPassword.hash).mockResolvedValue('new-hashed');
		vi.mocked(UserModel.findOneAndUpdate).mockResolvedValue(null);
		vi.mocked(RefreshTokenModel.updateMany).mockResolvedValue(
			undefined as never,
		);
		vi.mocked(SessionModel.deleteMany).mockResolvedValue(undefined as never);

		// Act
		await changePassword({
			userId: 'u1',
			currentPassword: 'old',
			newPassword: 'new',
		});

		// Assert
		expect(HashedPassword.hash).toHaveBeenCalledWith('new');
		expect(UserModel.findOneAndUpdate).toHaveBeenCalled();
		expect(RefreshTokenModel.updateMany).toHaveBeenCalled();
		expect(SessionModel.deleteMany).toHaveBeenCalledWith({ userId: 'u1' });
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		// Arrange
		vi.mocked(UserModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(
			changePassword({
				userId: 'u99',
				currentPassword: 'old',
				newPassword: 'new',
			}),
		).rejects.toBeInstanceOf(UserNotFoundError);
	});

	it('throws InvalidCredentialsError when current password is wrong', async () => {
		// Arrange
		const mockUser: MockUser = { id: 'u1', password: 'hashed' };
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);
		vi.mocked(HashedPassword.compare).mockResolvedValue(false);

		// Act & Assert
		await expect(
			changePassword({
				userId: 'u1',
				currentPassword: 'wrong',
				newPassword: 'new',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
