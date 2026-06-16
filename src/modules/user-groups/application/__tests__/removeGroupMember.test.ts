import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { removeGroupMember } from '@Modules/user-groups/application/removeGroupMember';
import { UserGroupNotFoundError } from '@Modules/user-groups/domain/errors/UserGroupErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

const seedGroup = () =>
	UserGroupModel.create({
		name: `Group ${crypto.randomUUID().slice(0, 8)}`,
		slug: `group-${crypto.randomUUID().slice(0, 8)}`,
	});

const seedUser = (overrides = {}) =>
	UserModel.create({
		email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'h',
		firstName: 'Aa',
		lastName: 'Bb',
		...overrides,
	});

describe('removeGroupMember', () => {
	it('removes a single membership, keeping the others', async () => {
		const groupA = await seedGroup();
		const groupB = await seedGroup();
		const user = await seedUser({ groupIds: [groupA.id, groupB.id] });

		const result = await removeGroupMember(groupA.id, user.id);

		expect(result).toEqual({ groupId: groupA.id, userId: user.id });
		const reloaded = await UserModel.findOne({ id: user.id });
		expect(reloaded?.groupIds).toEqual([groupB.id]);
	});

	it('is idempotent when the user is not a member', async () => {
		const group = await seedGroup();
		const user = await seedUser({ groupIds: [] });

		await expect(removeGroupMember(group.id, user.id)).resolves.toEqual({
			groupId: group.id,
			userId: user.id,
		});
	});

	it('throws when the group does not exist', async () => {
		const user = await seedUser();
		await expect(removeGroupMember('ghost', user.id)).rejects.toBeInstanceOf(
			UserGroupNotFoundError,
		);
	});

	it('throws when the user does not exist', async () => {
		const group = await seedGroup();
		await expect(removeGroupMember(group.id, 'ghost')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
