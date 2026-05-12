import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { getMyProfile } from '@Modules/users/application/getMyProfile';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

describe('getMyProfile', () => {
	it('returns the authenticated user profile without password', async () => {
		const created = await UserModel.create({
			email: `me-${crypto.randomUUID().slice(0, 8)}@test.com`,
			password: 'hashed',
			firstName: 'Alice',
			lastName: 'Smith',
		});

		const result = await getMyProfile(created.id);

		expect(result.id).toBe(created.id);
		expect(result.firstName).toBe('Alice');
		expect((result as Record<string, unknown>).password).toBeUndefined();
	});

	it('throws UserNotFoundError when userId does not exist', async () => {
		await expect(getMyProfile('nonexistent-id')).rejects.toBeInstanceOf(
			UserNotFoundError,
		);
	});
});
