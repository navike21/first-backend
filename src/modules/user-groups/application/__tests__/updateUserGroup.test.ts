import { describe, it, expect, beforeAll } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { updateUserGroup } from '@Modules/user-groups/application/updateUserGroup';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
	UserGroupSlugConflictError,
} from '@Modules/user-groups/domain/errors/UserGroupErrors';

withMongo();

beforeAll(async () => {
	await UserGroupModel.syncIndexes();
});

const seed = (overrides = {}) =>
	UserGroupModel.create({
		name: `Group ${crypto.randomUUID().slice(0, 8)}`,
		slug: `group-${crypto.randomUUID().slice(0, 8)}`,
		...overrides,
	});

describe('updateUserGroup', () => {
	it('renames a group and updates the slug', async () => {
		const group = await seed();

		const result = await updateUserGroup(group.id, { name: 'New Name Here' });

		expect(result.name).toBe('New Name Here');
		expect(result.slug).toBe('new-name-here');

		const inDb = await UserGroupModel.findOne({ id: group.id });
		expect(inDb!.slug).toBe('new-name-here');
	});

	it('updates fields without renaming when no name is provided', async () => {
		const group = await seed();
		const originalSlug = group.slug;

		await updateUserGroup(group.id, { description: 'Updated description' });

		const inDb = await UserGroupModel.findOne({ id: group.id });
		expect(inDb!.slug).toBe(originalSlug);
	});

	it('throws UserGroupNotFoundError when group does not exist', async () => {
		await expect(
			updateUserGroup('nonexistent-id', { name: 'X' }),
		).rejects.toBeInstanceOf(UserGroupNotFoundError);
	});

	it('throws SystemGroupModificationError for system groups', async () => {
		const group = await seed({ isSystem: true });

		await expect(
			updateUserGroup(group.id, { name: 'Changed' }),
		).rejects.toBeInstanceOf(SystemGroupModificationError);
	});

	it('throws UserGroupSlugConflictError when new name conflicts with existing slug', async () => {
		await seed({ name: 'Existing Name', slug: 'existing-name' });
		const group = await seed();

		await expect(
			updateUserGroup(group.id, { name: 'Existing Name' }),
		).rejects.toBeInstanceOf(UserGroupSlugConflictError);
	});
});
