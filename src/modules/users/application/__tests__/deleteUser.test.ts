import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { deleteUser } from '@Modules/users/application/deleteUser';
import { deleteUserLogical } from '@Modules/users/application/deleteUserLogical';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

const seed = (overrides = {}) =>
	UserModel.create({
		email: `user-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'hashed',
		firstName: 'John',
		lastName: 'Doe',
		...overrides,
	});

describe('deleteUser (hard)', () => {
	it('removes the user from the database', async () => {
		const user = await seed();

		await deleteUser(user.id);

		expect(await UserModel.findOne({ id: user.id })).toBeNull();
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		await expect(deleteUser('nonexistent-id')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});

describe('deleteUserLogical (soft)', () => {
	it('sets status to deleted without removing the document', async () => {
		const user = await seed();

		await deleteUserLogical(user.id);

		const inDb = await UserModel.findOne({ id: user.id });
		expect(inDb).not.toBeNull();
		expect(inDb!.status).toBe('deleted');
	});

	it('returns the user data without password', async () => {
		const user = await seed();

		const result = await deleteUserLogical(user.id);

		expect(result.id).toBe(user.id);
		expect((result as Record<string, unknown>).password).toBeUndefined();
	});

	it('throws UserNotFoundError when user is already deleted', async () => {
		const user = await seed({ status: 'deleted' });

		await expect(deleteUserLogical(user.id)).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
