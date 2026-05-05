import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserGroupDocument } from '@Modules/user-groups/infrastructure/UserGroupModel';
import { updateUserGroup } from '@Modules/user-groups/application/updateUserGroup';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
	UserGroupSlugConflictError,
} from '@Modules/user-groups/domain/errors/UserGroupErrors';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';

vi.mock('@Modules/user-groups/infrastructure/UserGroupModel', () => ({
	default: { findOne: vi.fn() },
}));

type MockGroupDoc = Pick<
	UserGroupDocument,
	'id' | 'name' | 'slug' | 'isSystem'
> & {
	save: () => Promise<void>;
};

describe('updateUserGroup', () => {
	it('updates and saves the group when it exists and is not a system group', async () => {
		// Arrange
		const mockGroup: MockGroupDoc = {
			id: 'g1',
			name: 'Users',
			slug: 'users',
			isSystem: false,
			save: vi.fn().mockResolvedValue(undefined),
		};
		vi.mocked(UserGroupModel.findOne)
			.mockResolvedValueOnce(
				mockGroup as unknown as HydratedDocument<UserGroupDocument>,
			)
			.mockResolvedValueOnce(null);

		// Act
		const result = await updateUserGroup('g1', { name: 'Updated Users' });

		// Assert
		expect(mockGroup.save).toHaveBeenCalled();
		expect(result).toBe(mockGroup);
	});

	it('updates without slug change when no name is provided in the input', async () => {
		// Arrange
		const mockGroup: MockGroupDoc = {
			id: 'g1',
			name: 'Users',
			slug: 'users',
			isSystem: false,
			save: vi.fn().mockResolvedValue(undefined),
		};
		vi.mocked(UserGroupModel.findOne).mockResolvedValueOnce(
			mockGroup as unknown as HydratedDocument<UserGroupDocument>,
		);

		// Act
		const result = await updateUserGroup('g1', {
			description: 'Updated description',
		});

		// Assert
		expect(mockGroup.save).toHaveBeenCalled();
		expect(result).toBe(mockGroup);
		expect(UserGroupModel.findOne).toHaveBeenCalledTimes(1);
	});

	it('throws UserGroupNotFoundError when the group does not exist', async () => {
		// Arrange
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(null);

		// Act & Assert
		await expect(
			updateUserGroup('missing', { name: 'X' }),
		).rejects.toBeInstanceOf(UserGroupNotFoundError);
	});

	it('throws SystemGroupModificationError for system groups', async () => {
		// Arrange
		const systemGroup: MockGroupDoc = {
			id: 'g-sys',
			name: 'System',
			slug: 'system',
			isSystem: true,
			save: vi.fn(),
		};
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(
			systemGroup as unknown as HydratedDocument<UserGroupDocument>,
		);

		// Act & Assert
		await expect(
			updateUserGroup('g-sys', { name: 'Changed' }),
		).rejects.toBeInstanceOf(SystemGroupModificationError);
	});

	it('throws UserGroupSlugConflictError when renaming would create a slug conflict', async () => {
		// Arrange
		const mockGroup: MockGroupDoc = {
			id: 'g1',
			name: 'Users',
			slug: 'users',
			isSystem: false,
			save: vi.fn(),
		};
		vi.mocked(UserGroupModel.findOne)
			.mockResolvedValueOnce(
				mockGroup as unknown as HydratedDocument<UserGroupDocument>,
			)
			.mockResolvedValueOnce({
				id: 'g2',
			} as unknown as HydratedDocument<UserGroupDocument>);

		// Act & Assert
		await expect(
			updateUserGroup('g1', { name: 'Admins' }),
		).rejects.toBeInstanceOf(UserGroupSlugConflictError);
	});
});
