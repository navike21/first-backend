import { describe, it, expect, vi } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserGroupDocument } from '@Modules/user-groups/infrastructure/UserGroupModel';
import { createUserGroup } from '@Modules/user-groups/application/createUserGroup';
import { UserGroupSlugConflictError } from '@Modules/user-groups/domain/errors/UserGroupErrors';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';

vi.mock('@Modules/user-groups/infrastructure/UserGroupModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

type MockGroup = Pick<UserGroupDocument, 'id' | 'name' | 'slug'>;

describe('createUserGroup', () => {
	it('creates a group with the slugified name when no conflict exists', async () => {
		// Arrange
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(null);
		const created: MockGroup = {
			id: 'g1',
			name: 'Admin Users',
			slug: 'admin-users',
		};
		vi.mocked(UserGroupModel.create).mockResolvedValue(
			created as unknown as HydratedDocument<UserGroupDocument>[],
		);

		// Act
		const result = await createUserGroup({
			name: 'Admin Users',
			permissions: [],
			color: '#6366f1',
			status: 'active',
		});

		// Assert
		expect(UserGroupModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ slug: 'admin-users' }),
		);
		expect(result.name).toBe('Admin Users');
	});

	it('throws UserGroupSlugConflictError when a group with the same slug already exists', async () => {
		// Arrange
		vi.mocked(UserGroupModel.findOne).mockResolvedValue({
			id: 'existing',
		} as unknown as HydratedDocument<UserGroupDocument>);

		// Act & Assert
		await expect(
			createUserGroup({
				name: 'Admin Users',
				permissions: [],
				color: '#6366f1',
				status: 'active',
			}),
		).rejects.toBeInstanceOf(UserGroupSlugConflictError);
	});

	it('removes special characters from the slug', async () => {
		// Arrange
		vi.mocked(UserGroupModel.findOne).mockResolvedValue(null);
		vi.mocked(UserGroupModel.create).mockResolvedValue({
			id: 'g2',
			name: 'Super & Admins',
			slug: 'super-admins',
		} as unknown as HydratedDocument<UserGroupDocument>[]);

		// Act
		await createUserGroup({
			name: 'Super & Admins!',
			permissions: [],
			color: '#6366f1',
			status: 'active',
		});

		// Assert
		expect(UserGroupModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ slug: 'super-admins' }),
		);
	});
});
