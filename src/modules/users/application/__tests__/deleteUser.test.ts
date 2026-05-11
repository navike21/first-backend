import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { deleteUser } from '@Modules/users/application/deleteUser';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import UserModel from '@Modules/users/infrastructure/UserModel';

vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: { findOne: vi.fn() },
}));

type MockUserDoc = Pick<UserDocument, 'id'> & {
	deleteOne: () => Promise<void>;
};

describe('deleteUser', () => {
	it('deletes the user when found', async () => {
		// Arrange
		const mockUser: MockUserDoc = {
			id: 'u1',
			deleteOne: vi.fn().mockResolvedValue(undefined),
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);

		// Act
		await deleteUser('u1');

		// Assert
		expect(UserModel.findOne).toHaveBeenCalledWith({ id: 'u1' });
		expect(mockUser.deleteOne).toHaveBeenCalled();
	});

	it('throws UserNotFoundError when the user does not exist', async () => {
		// Arrange
		vi.mocked(UserModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(deleteUser('missing')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
