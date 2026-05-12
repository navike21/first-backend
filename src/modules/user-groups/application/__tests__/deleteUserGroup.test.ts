import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
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

describe('deleteUserGroup', () => {
	it('deletes the group from the database', async () => {
		const group = await seed();

		await deleteUserGroup(group.id);

		const inDb = await UserGroupModel.findOne({ id: group.id });
		expect(inDb).toBeNull();
	});

	it('throws UserGroupNotFoundError when group does not exist', async () => {
		await expect(deleteUserGroup('nonexistent-id')).rejects.toBeInstanceOf(
			UserGroupNotFoundError,
		);
	});

	it('throws SystemGroupModificationError for system groups', async () => {
		const group = await seed({ isSystem: true });

		await expect(deleteUserGroup(group.id)).rejects.toBeInstanceOf(
			SystemGroupModificationError,
		);

		const inDb = await UserGroupModel.findOne({ id: group.id });
		expect(inDb).not.toBeNull();
	});
});
