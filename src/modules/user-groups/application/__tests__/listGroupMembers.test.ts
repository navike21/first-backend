import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { listGroupMembers } from '@Modules/user-groups/application/listGroupMembers';
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

describe('listGroupMembers', () => {
	it('returns only the users that belong to the group', async () => {
		const group = await seedGroup();
		const other = await seedGroup();
		await seedUser({ groupIds: [group.id] });
		await seedUser({ groupIds: [group.id] });
		await seedUser({ groupIds: [other.id] });

		const result = await listGroupMembers(group.id, { page: 1, limit: 10 });

		expect(result.items).toHaveLength(2);
		expect(result.total).toBe(2);
		expect(result.items.every((u) => u.groupIds.includes(group.id))).toBe(true);
	});

	it('excludes soft-deleted members', async () => {
		const group = await seedGroup();
		await seedUser({ groupIds: [group.id] });
		await seedUser({ groupIds: [group.id], deletedAt: new Date() });

		const result = await listGroupMembers(group.id, { page: 1, limit: 10 });

		expect(result.total).toBe(1);
	});

	it('filters members by search term', async () => {
		const group = await seedGroup();
		await seedUser({ groupIds: [group.id], firstName: 'Zorana' });
		await seedUser({ groupIds: [group.id], firstName: 'Other' });

		const result = await listGroupMembers(group.id, {
			page: 1,
			limit: 10,
			search: 'Zoran',
		});

		expect(result.items).toHaveLength(1);
		expect(result.items[0].firstName).toBe('Zorana');
	});

	it('throws when the group does not exist', async () => {
		await expect(
			listGroupMembers('ghost', { page: 1, limit: 10 }),
		).rejects.toBeInstanceOf(UserGroupNotFoundError);
	});
});
