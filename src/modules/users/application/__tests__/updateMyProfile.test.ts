import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { updateMyProfile } from '@Modules/users/application/updateMyProfile';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

describe('updateMyProfile', () => {
	it('updates profile fields and persists to DB', async () => {
		const user = await UserModel.create({
			email: `me-${crypto.randomUUID().slice(0, 8)}@test.com`,
			password: 'hashed',
			firstName: 'Alice',
			lastName: 'Smith',
		});

		const result = await updateMyProfile(user.id, { firstName: 'Alicia' });

		expect(result.data.firstName).toBe('Alicia');

		const inDb = await UserModel.findOne({ id: user.id });
		expect(inDb!.firstName).toBe('Alicia');
	});

	it('throws UserNotFoundError when userId does not exist', async () => {
		await expect(
			updateMyProfile('nonexistent-id', { firstName: 'X' }),
		).rejects.toBeInstanceOf(UserNotFoundError);
	});
});
