import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { deleteUserGroup } from '@Modules/user-groups/application/deleteUserGroup';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
} from '@Modules/user-groups/domain/errors/UserGroupErrors';

withMongo();

const seed = (overrides = {}) =>
	UserGroupModel.create({
		name: `Group ${crypto.randomUUID().slice(0, 8)}`,
		slug: `group-${crypto.randomUUID().slice(0, 8)}`,
		...overrides,
	});

const seedUser = (overrides = {}) =>
	UserModel.create({
		email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'h',
		firstName: 'Aa',
		lastName: 'Bb',
		...overrides,
	});

describe('deleteUserGroup', () => {
	it('deletes the group from the database', async () => {
		// Hard delete only applies to groups already in the trash (deletedAt set).
		const group = await seed({ deletedAt: new Date() });

		await deleteUserGroup(group.id);

		const inDb = await UserGroupModel.findOne({ id: group.id });
		expect(inDb).toBeNull();
	});

	it('pulls the group reference from every user, incl. soft-deleted ones', async () => {
		const group = await seed({ deletedAt: new Date() });
		const other = await seed();
		const active = await seedUser({ groupIds: [group.id, other.id] });
		const trashed = await seedUser({
			groupIds: [group.id],
			deletedAt: new Date(),
		});

		await deleteUserGroup(group.id);

		const a = await UserModel.findOne({ id: active.id });
		const t = await UserModel.findOne({ id: trashed.id });
		// The dangling reference is gone, other memberships are untouched.
		expect(a?.groupIds).toEqual([other.id]);
		expect(t?.groupIds).toEqual([]);
	});

	it('throws UserGroupNotFoundError when group does not exist', async () => {
		await expect(deleteUserGroup('nonexistent-id')).rejects.toBeInstanceOf(
			UserGroupNotFoundError,
		);
	});

	it('throws SystemGroupModificationError for system groups', async () => {
		const group = await seed({ isSystem: true, deletedAt: new Date() });

		await expect(deleteUserGroup(group.id)).rejects.toBeInstanceOf(
			SystemGroupModificationError,
		);

		const inDb = await UserGroupModel.findOne({ id: group.id });
		expect(inDb).not.toBeNull();
	});
});
