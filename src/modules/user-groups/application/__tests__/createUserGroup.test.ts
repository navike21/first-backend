import { describe, it, expect, beforeAll } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { createUserGroup } from '@Modules/user-groups/application/createUserGroup';
import { UserGroupSlugConflictError } from '@Modules/user-groups/domain/errors/UserGroupErrors';

withMongo();

beforeAll(async () => {
	await UserGroupModel.syncIndexes();
});

const baseInput = (name = `Group ${Date.now()}`) => ({
	name,
	permissions: [] as string[],
	color: '#6366f1' as string,
	status: 'active' as const,
});

describe('createUserGroup', () => {
	it('creates a group and generates slug from name', async () => {
		const result = await createUserGroup(baseInput('Admin Users'));

		expect(result.name).toBe('Admin Users');
		expect(result.slug).toBe('admin-users');
		expect(result.id).toBeDefined();
	});

	it('strips special characters from slug', async () => {
		const result = await createUserGroup(baseInput('Super & Admins!'));

		expect(result.slug).toBe('super-admins');
	});

	it('applies default permissions, color, and status', async () => {
		const result = await createUserGroup({ name: `G-${Date.now()}`, permissions: [] });

		expect(result.permissions).toEqual([]);
		expect(result.color).toBe('#6366f1');
		expect(result.status).toBe('active');
		expect(result.isSystem).toBe(false);
	});

	it('throws UserGroupSlugConflictError when slug already exists', async () => {
		await createUserGroup(baseInput('Duplicate Name'));

		await expect(createUserGroup(baseInput('Duplicate Name'))).rejects.toBeInstanceOf(
			UserGroupSlugConflictError,
		);
	});

	it('persists the group in the database', async () => {
		const result = await createUserGroup(baseInput('Persisted Group'));

		const found = await UserGroupModel.findOne({ id: result.id });
		expect(found).not.toBeNull();
		expect(found!.name).toBe('Persisted Group');
	});
});
