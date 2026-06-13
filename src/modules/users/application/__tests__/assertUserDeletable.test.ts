import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { assertUserDeletable } from '@Modules/users/application/assertUserDeletable';
import {
	CannotDeleteSelfError,
	LastSuperAdminError,
} from '@Modules/users/domain/errors/UserErrors';

withMongo();

const seedGroup = (permissions: string[], name: string) =>
	UserGroupModel.create({
		name,
		slug: `${name}-${crypto.randomUUID().slice(0, 6)}`,
		permissions,
	});

const seedUser = (groupId?: string) =>
	UserModel.create({
		email: `u-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'h',
		firstName: 'Aa',
		lastName: 'Bb',
		groupId,
	});

describe('assertUserDeletable', () => {
	it('throws when deleting your own account', async () => {
		const user = await seedUser();
		await expect(assertUserDeletable(user.id, user.id)).rejects.toBeInstanceOf(
			CannotDeleteSelfError,
		);
	});

	it('allows deleting a user with no group', async () => {
		const user = await seedUser();
		await expect(assertUserDeletable(user.id)).resolves.toBeUndefined();
	});

	it('allows deleting a non-super user', async () => {
		const group = await seedGroup(['users:read'], 'editors');
		const user = await seedUser(group.id);
		await expect(assertUserDeletable(user.id)).resolves.toBeUndefined();
	});

	it('throws when deleting the last super-admin', async () => {
		const group = await seedGroup(['*:*'], 'super');
		const user = await seedUser(group.id);
		await expect(assertUserDeletable(user.id)).rejects.toBeInstanceOf(
			LastSuperAdminError,
		);
	});

	it('allows deleting a super-admin when another active super exists', async () => {
		const group = await seedGroup(['*:*'], 'super');
		const first = await seedUser(group.id);
		await seedUser(group.id);
		await expect(assertUserDeletable(first.id)).resolves.toBeUndefined();
	});
});
