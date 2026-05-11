import { describe, it, expect, vi } from 'vitest';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { getMyProfile } from '@Modules/users/application/getMyProfile';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import UserModel from '@Modules/users/infrastructure/UserModel';

vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: { findOne: vi.fn() },
}));

type MockUser = Pick<UserDocument, 'id' | 'firstName' | 'email'>;

function buildFindOneChain(data: MockUser | null) {
	return { select: vi.fn().mockResolvedValue(data) };
}

describe('getMyProfile', () => {
	it('returns the user profile when found', async () => {
		// Arrange
		const mockUser: MockUser = { id: 'u1', firstName: 'Alice', email: 'a@b.c' };
		vi.mocked(UserModel.findOne).mockReturnValue(
			buildFindOneChain(mockUser) as unknown as ReturnType<
				typeof UserModel.findOne
			>,
		);

		// Act
		const result = await getMyProfile('u1');

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
		await expect(getMyProfile('missing')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
