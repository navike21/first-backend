import { describe, it, expect, vi } from 'vitest';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { getUserById } from '@Modules/users/application/getUserById';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import UserModel from '@Modules/users/infrastructure/UserModel';

vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: { findOne: vi.fn() },
}));

type MockUser = Pick<UserDocument, 'id' | 'firstName' | 'lastName' | 'email'>;

function buildFindOneChain(data: MockUser | null) {
	return { select: vi.fn().mockResolvedValue(data) };
}

describe('getUserById', () => {
	it('returns the user when found', async () => {
		// Arrange
		const mockUser: MockUser = {
			id: 'u1',
			firstName: 'Alice',
			lastName: 'Smith',
			email: 'a@b.c',
		};
		vi.mocked(UserModel.findOne).mockReturnValue(
			buildFindOneChain(mockUser) as unknown as ReturnType<
				typeof UserModel.findOne
			>,
		);

		// Act
		const result = await getUserById('u1');

		// Assert
		expect(result).toEqual(mockUser);
		expect(UserModel.findOne).toHaveBeenCalledWith({ id: 'u1' });
	});

	it('throws UserNotFoundError when the user is not found', async () => {
		// Arrange
		vi.mocked(UserModel.findOne).mockReturnValue(
			buildFindOneChain(null) as unknown as ReturnType<
				typeof UserModel.findOne
			>,
		);

		// Act & Assert
		await expect(getUserById('missing')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
