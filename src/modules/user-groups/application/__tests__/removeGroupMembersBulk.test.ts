import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { removeGroupMembersBulk } from '@Modules/user-groups/application/removeGroupMembersBulk';
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

describe('removeGroupMembersBulk', () => {
	it('removes several members at once, keeping other memberships', async () => {
		const groupA = await seedGroup();
		const groupB = await seedGroup();
		const u1 = await seedUser({ groupIds: [groupA.id, groupB.id] });
		const u2 = await seedUser({ groupIds: [groupA.id] });

		const result = await removeGroupMembersBulk(groupA.id, [u1.id, u2.id]);

		expect(result.groupId).toBe(groupA.id);
		expect(result.removedIds).toHaveLength(2);
		expect(result.removedIds).toEqual(expect.arrayContaining([u1.id, u2.id]));
		expect(result.notFoundIds).toEqual([]);

		const r1 = await UserModel.findOne({ id: u1.id });
		const r2 = await UserModel.findOne({ id: u2.id });
		expect(r1?.groupIds).toEqual([groupB.id]);
		expect(r2?.groupIds).toEqual([]);
	});

	it('reports unknown / soft-deleted users in notFoundIds', async () => {
		const group = await seedGroup();
		const active = await seedUser({ groupIds: [group.id] });
		const deleted = await seedUser({
			groupIds: [group.id],
			deletedAt: new Date(),
		});

		const result = await removeGroupMembersBulk(group.id, [
			active.id,
			deleted.id,
			'ghost',
		]);

		expect(result.removedIds).toEqual([active.id]);
		expect(result.notFoundIds).toEqual(
			expect.arrayContaining([deleted.id, 'ghost']),
		);
	});

	it('is idempotent when users are not members', async () => {
		const group = await seedGroup();
		const user = await seedUser({ groupIds: [] });

		const result = await removeGroupMembersBulk(group.id, [user.id]);

		expect(result.removedIds).toEqual([user.id]);
		const reloaded = await UserModel.findOne({ id: user.id });
		expect(reloaded?.groupIds).toEqual([]);
	});

	it('throws when the group does not exist', async () => {
		const user = await seedUser();
		await expect(
			removeGroupMembersBulk('ghost', [user.id]),
		).rejects.toBeInstanceOf(UserGroupNotFoundError);
	});
});
