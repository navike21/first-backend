import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserGroupDocument } from '@Modules/user-groups/infrastructure/UserGroupModel';
import { getUserGroupById } from '@Modules/user-groups/application/getUserGroupById';
import { UserGroupNotFoundError } from '@Modules/user-groups/domain/errors/UserGroupErrors';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';

vi.mock('@Modules/user-groups/infrastructure/UserGroupModel', () => ({
	default: { findOne: vi.fn() },
}));

type MockGroup = Pick<UserGroupDocument, 'id' | 'name' | 'slug'>;

describe('getUserGroupById', () => {
	it('returns the group when found', async () => {
		// Arrange
		const mockGroup: MockGroup = { id: 'g1', name: 'Admin', slug: 'admin' };
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(
			mockGroup as unknown as HydratedDocument<UserGroupDocument>,
		);

		// Act
		const result = await getUserGroupById('g1');

		// Assert
		expect(result).toEqual(mockGroup);
		expect(UserGroupModel.findOne).toHaveBeenCalledWith({ id: 'g1' });
	});

	it('throws UserGroupNotFoundError when the group is not found', async () => {
		// Arrange
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(getUserGroupById('missing')).rejects.toBeInstanceOf(
			UserGroupNotFoundError,
		);
	});
});
