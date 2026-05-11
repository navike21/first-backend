import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import { updateMyProfile } from '@Modules/users/application/updateMyProfile';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import UserModel from '@Modules/users/infrastructure/UserModel';

vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: { findOne: vi.fn() },
}));

type MockUserDoc = Pick<
	UserDocument,
	'id' | 'firstName' | 'lastName' | 'email' | 'password'
> & {
	save: () => Promise<void>;
	toObject: () => Record<string, unknown>;
};

describe('updateMyProfile', () => {
	it('updates profile fields and returns the user without password', async () => {
		// Arrange
		const mockUser: MockUserDoc = {
			id: 'u1',
			firstName: 'Alice',
			lastName: 'Smith',
			email: 'a@b.c',
			password: 'hashed',
			save: vi.fn().mockResolvedValue(undefined),
			toObject: vi.fn().mockReturnValue({
				id: 'u1',
				firstName: 'Alice Updated',
				lastName: 'Smith',
				email: 'a@b.c',
				password: 'hashed',
			}),
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);

		// Act
		const result = await updateMyProfile('u1', { firstName: 'Alice Updated' });

		// Assert
		expect(mockUser.save).toHaveBeenCalled();
		expect(result).not.toHaveProperty('password');
		expect(result.firstName).toBe('Alice Updated');
	});

	it('converts dateOfBirth string to Date when provided', async () => {
		// Arrange
		const mockUser: MockUserDoc = {
			id: 'u1',
			firstName: 'Alice',
			lastName: 'Smith',
			email: 'a@b.c',
			password: 'hashed',
			save: vi.fn().mockResolvedValue(undefined),
			toObject: vi.fn().mockReturnValue({
				id: 'u1',
				firstName: 'Alice',
				email: 'a@b.c',
				password: 'hashed',
			}),
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(
			mockUser as unknown as HydratedDocument<UserDocument>,
		);

		// Act
		await updateMyProfile('u1', { dateOfBirth: '1990-01-01' });

		// Assert
		expect(mockUser.save).toHaveBeenCalled();
	});

	it('throws UserNotFoundError when the user does not exist', async () => {
		// Arrange
		vi.mocked(UserModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(
			updateMyProfile('missing', { firstName: 'X' }),
		).rejects.toBeInstanceOf(UserNotFoundError);
	});
});
