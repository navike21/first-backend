import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { updateUser } from '@Modules/users/application/updateUser';
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

describe('updateUser', () => {
	it('updates user fields and persists to DB', async () => {
		const user = await seed();

		const result = await updateUser(user.id, {
			firstName: 'Updated',
			lastName: 'Name',
		});

		expect(result.data.firstName).toBe('Updated');
		expect(result.data.lastName).toBe('Name');

		const inDb = await UserModel.findOne({ id: user.id });
		expect(inDb!.firstName).toBe('Updated');
	});

	it('does not expose password in the returned object', async () => {
		const user = await seed();

		const result = await updateUser(user.id, { firstName: 'Xi' });

		expect((result.data as Record<string, unknown>).password).toBeUndefined();
	});

	it('converts dateOfBirth string to Date', async () => {
		const user = await seed();

		await updateUser(user.id, { dateOfBirth: '1990-05-15' });

		const inDb = await UserModel.findOne({ id: user.id });
		expect(inDb!.dateOfBirth).toBeInstanceOf(Date);
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		await expect(
			updateUser('nonexistent-id', { firstName: 'X' }),
		).rejects.toBeInstanceOf(UserNotFoundError);
	});
});
