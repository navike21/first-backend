import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserGroupDocument } from '@Modules/user-groups/infrastructure/UserGroupModel';
import { deleteUserGroup } from '@Modules/user-groups/application/deleteUserGroup';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
} from '@Modules/user-groups/domain/errors/UserGroupErrors';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';

vi.mock('@Modules/user-groups/infrastructure/UserGroupModel', () => ({
	default: { findOne: vi.fn() },
}));

type MockGroupDoc = Pick<UserGroupDocument, 'id' | 'isSystem'> & {
	deleteOne: () => Promise<void>;
};

describe('deleteUserGroup', () => {
	it('deletes the group when it exists and is not a system group', async () => {
		// Arrange
		const mockGroup: MockGroupDoc = {
			id: 'g1',
			isSystem: false,
			deleteOne: vi.fn().mockResolvedValue(undefined),
		};
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(
			mockGroup as unknown as HydratedDocument<UserGroupDocument>,
		);

		// Act
		await deleteUserGroup('g1');

		// Assert
		expect(mockGroup.deleteOne).toHaveBeenCalled();
	});

	it('throws UserGroupNotFoundError when the group does not exist', async () => {
		// Arrange
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(deleteUserGroup('missing')).rejects.toBeInstanceOf(
			UserGroupNotFoundError,
		);
	});

	it('throws SystemGroupModificationError for system groups', async () => {
		// Arrange
		const systemGroup: MockGroupDoc = {
			id: 'g-sys',
			isSystem: true,
			deleteOne: vi.fn(),
		};
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(
			systemGroup as unknown as HydratedDocument<UserGroupDocument>,
		);

		// Act & Assert
		await expect(deleteUserGroup('g-sys')).rejects.toBeInstanceOf(
			SystemGroupModificationError,
		);
	});
});
