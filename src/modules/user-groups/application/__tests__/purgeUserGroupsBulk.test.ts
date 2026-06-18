import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { purgeUserGroupsBulk } from '@Modules/user-groups/application/purgeUserGroupsBulk';

withMongo();

const seedGroup = (overrides = {}) =>
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

describe('purgeUserGroupsBulk', () => {
	it('purges trashed groups and reports them in processedIds', async () => {
		const g1 = await seedGroup({ deletedAt: new Date() });
		const g2 = await seedGroup({ deletedAt: new Date() });

		const result = await purgeUserGroupsBulk([g1.id, g2.id]);

		expect(result.processedIds).toEqual(
			expect.arrayContaining([g1.id, g2.id]),
		);
		expect(result.notFoundIds).toEqual([]);
		expect(await UserGroupModel.findOne({ id: g1.id })).toBeNull();
		expect(await UserGroupModel.findOne({ id: g2.id })).toBeNull();
	});

	it('pulls every reference to the purged groups from all users, incl. soft-deleted', async () => {
		const g1 = await seedGroup({ deletedAt: new Date() });
		const g2 = await seedGroup({ deletedAt: new Date() });
		const survivor = await seedGroup();
		const active = await seedUser({ groupIds: [g1.id, g2.id, survivor.id] });
		const trashed = await seedUser({
			groupIds: [g1.id],
			deletedAt: new Date(),
		});

		await purgeUserGroupsBulk([g1.id, g2.id]);

		const a = await UserModel.findOne({ id: active.id });
		const t = await UserModel.findOne({ id: trashed.id });
		// Only the surviving (non-purged) membership remains.
		expect(a?.groupIds).toEqual([survivor.id]);
		expect(t?.groupIds).toEqual([]);
	});

	it('ignores groups that are not in the trash (reports notFoundIds)', async () => {
		const active = await seedGroup(); // not soft-deleted
		const trashed = await seedGroup({ deletedAt: new Date() });

		const result = await purgeUserGroupsBulk([active.id, trashed.id, 'ghost']);

		expect(result.processedIds).toEqual([trashed.id]);
		expect(result.notFoundIds).toEqual(
			expect.arrayContaining([active.id, 'ghost']),
		);
		// The non-trashed group is left intact.
		expect(await UserGroupModel.findOne({ id: active.id })).not.toBeNull();
	});

	it('returns empty results when nothing matches', async () => {
		const result = await purgeUserGroupsBulk(['ghost-1', 'ghost-2']);

		expect(result.processed).toEqual([]);
		expect(result.processedIds).toEqual([]);
		expect(result.notFoundIds).toEqual(['ghost-1', 'ghost-2']);
	});
});
