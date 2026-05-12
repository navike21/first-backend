import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { getUserById } from '@Modules/users/application/getUserById';
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

describe('getUserById', () => {
	it('returns the user without the password field', async () => {
		const created = await seed();

		const result = await getUserById(created.id);

		expect(result.id).toBe(created.id);
		expect(result.email).toBe(created.email);
		expect((result as Record<string, unknown>).password).toBeUndefined();
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		await expect(getUserById('nonexistent-id')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
