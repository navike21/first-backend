import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { deleteUserLogical } from '@Modules/users/application/deleteUserLogical';
import {
	CannotDeleteSelfError,
	LastSuperAdminError,
	UserNotFoundError,
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
		groupIds: groupId ? [groupId] : [],
	});

describe('deleteUserLogical', () => {
	it('throws when deleting your own account', async () => {
		const user = await seedUser();
		await expect(deleteUserLogical(user.id, user.id)).rejects.toBeInstanceOf(
			CannotDeleteSelfError,
		);
	});

	it('throws when the user does not exist or is already deleted', async () => {
		await expect(deleteUserLogical('missing-id')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});

	it('soft-deletes a non-super user', async () => {
		const group = await seedGroup(['users:read'], 'editors');
		const user = await seedUser(group.id);

		await deleteUserLogical(user.id);

		const stored = await UserModel.findOne({ id: user.id }).lean();
		expect(stored?.deletedAt).not.toBeNull();
	});

	it('soft-deletes a super-admin when another active super exists', async () => {
		const group = await seedGroup(['*:*'], 'super');
		const first = await seedUser(group.id);
		await seedUser(group.id);

		await deleteUserLogical(first.id);

		const stored = await UserModel.findOne({ id: first.id }).lean();
		expect(stored?.deletedAt).not.toBeNull();
	});

	it('rejects and restores the user when deleting the last super-admin', async () => {
		const group = await seedGroup(['*:*'], 'super');
		const user = await seedUser(group.id);

		await expect(deleteUserLogical(user.id)).rejects.toBeInstanceOf(
			LastSuperAdminError,
		);

		// Compensation: the tentative soft-delete must be rolled back.
		const stored = await UserModel.findOne({ id: user.id }).lean();
		expect(stored?.deletedAt).toBeNull();
	});
});
