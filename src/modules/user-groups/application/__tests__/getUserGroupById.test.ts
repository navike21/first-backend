import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { getUserGroupById } from '@Modules/user-groups/application/getUserGroupById';
import { UserGroupNotFoundError } from '@Modules/user-groups/domain/errors/UserGroupErrors';

withMongo();

describe('getUserGroupById', () => {
	it('returns the group when found', async () => {
		const created = await UserGroupModel.create({
			name: 'Admin',
			slug: 'admin',
		});

		const result = await getUserGroupById(created.id);

		expect(result.id).toBe(created.id);
		expect(result.name).toBe('Admin');
	});

	it('throws UserGroupNotFoundError when the group does not exist', async () => {
		await expect(getUserGroupById('nonexistent-id')).rejects.toBeInstanceOf(
			UserGroupNotFoundError,
		);
	});
});
