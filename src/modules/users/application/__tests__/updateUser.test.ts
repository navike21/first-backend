import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { updateUser } from '@Modules/users/application/updateUser';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';

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

	it('hashes a new password and stamps passwordChangedAt, never exposing it', async () => {
		const user = await seed();

		const result = await updateUser(user.id, { password: 'NewPass1' });

		// Not echoed back in the response.
		expect((result.data as Record<string, unknown>).password).toBeUndefined();

		const inDb = await UserModel.findOne({ id: user.id });
		// Stored hashed (not plaintext) and verifiable.
		expect(inDb!.password).not.toBe('NewPass1');
		expect(await HashedPassword.compare('NewPass1', inDb!.password)).toBe(true);
		// Stamped to invalidate the target's existing sessions / reset links.
		expect(inDb!.passwordChangedAt).toBeInstanceOf(Date);
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		await expect(
			updateUser('nonexistent-id', { firstName: 'X' }),
		).rejects.toBeInstanceOf(UserNotFoundError);
	});

	it('clears the avatar when profilePictureUrl is an empty string', async () => {
		const user = await seed({
			profilePictureUrl: 'https://cdn.test/avatar.png',
		});

		const result = await updateUser(user.id, { profilePictureUrl: '' });

		expect(
			(result.data as Record<string, unknown>).profilePictureUrl,
		).toBeUndefined();

		const inDb = await UserModel.findOne({ id: user.id });
		expect(inDb!.profilePictureUrl).toBeUndefined();
	});
});
