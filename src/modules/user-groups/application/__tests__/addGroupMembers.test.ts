import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { addGroupMembers } from '@Modules/user-groups/application/addGroupMembers';
import { UserGroupNotFoundError } from '@Modules/user-groups/domain/errors/UserGroupErrors';

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

describe('addGroupMembers', () => {
	it('adds existing users to the group and reports unknown ones', async () => {
		const group = await seedGroup();
		const u1 = await seedUser();
		const u2 = await seedUser();

		const result = await addGroupMembers(group.id, [u1.id, u2.id, 'ghost']);

		expect(result.groupId).toBe(group.id);
		expect(result.addedIds).toHaveLength(2);
		expect(result.addedIds).toEqual(expect.arrayContaining([u1.id, u2.id]));
		expect(result.notFoundIds).toEqual(['ghost']);

		const reloaded = await UserModel.findOne({ id: u1.id });
		expect(reloaded?.groupIds).toContain(group.id);
	});

	it('is idempotent (no duplicate membership)', async () => {
		const group = await seedGroup();
		const user = await seedUser({ groupIds: [group.id] });

		await addGroupMembers(group.id, [user.id]);

		const reloaded = await UserModel.findOne({ id: user.id });
		expect(reloaded?.groupIds.filter((id) => id === group.id)).toHaveLength(1);
	});

	it('preserves memberships in other groups', async () => {
		const groupA = await seedGroup();
		const groupB = await seedGroup();
		const user = await seedUser({ groupIds: [groupA.id] });

		await addGroupMembers(groupB.id, [user.id]);

		const reloaded = await UserModel.findOne({ id: user.id });
		expect(reloaded?.groupIds).toHaveLength(2);
		expect(reloaded?.groupIds).toEqual(
			expect.arrayContaining([groupA.id, groupB.id]),
		);
	});

	it('ignores soft-deleted users', async () => {
		const group = await seedGroup();
		const deleted = await seedUser({ deletedAt: new Date() });

		const result = await addGroupMembers(group.id, [deleted.id]);

		expect(result.addedIds).toHaveLength(0);
		expect(result.notFoundIds).toEqual([deleted.id]);
	});

	it('throws when the group does not exist', async () => {
		const user = await seedUser();
		await expect(addGroupMembers('ghost', [user.id])).rejects.toBeInstanceOf(
			UserGroupNotFoundError,
		);
	});
});
