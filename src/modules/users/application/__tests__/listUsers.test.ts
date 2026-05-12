import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { listUsers } from '@Modules/users/application/listUsers';

withMongo();

const seed = (overrides = {}) =>
	UserModel.create({
		email: `user-${crypto.randomUUID().slice(0, 8)}@test.com`,
		password: 'hashed',
		firstName: 'John',
		lastName: 'Doe',
		...overrides,
	});

describe('listUsers', () => {
	it('returns paginated users without password', async () => {
		await Promise.all([seed(), seed()]);

		const result = await listUsers({ page: 1, limit: 10 });

		expect(result.items.length).toBeGreaterThanOrEqual(2);
		expect(result.total).toBeGreaterThanOrEqual(2);
		result.items.forEach((u) => {
			expect((u as Record<string, unknown>).password).toBeUndefined();
		});
	});

	it('paginates correctly', async () => {
		await Promise.all([seed(), seed(), seed()]);

		const page1 = await listUsers({ page: 1, limit: 2 });
		const page2 = await listUsers({ page: 2, limit: 2 });

		expect(page1.items).toHaveLength(2);
		expect(page1.items[0].id).not.toBe(page2.items[0]?.id);
	});

	it('filters by status', async () => {
		await seed({ status: 'inactive' });

		const result = await listUsers({ page: 1, limit: 20, status: 'inactive' });

		expect(result.items.every((u) => u.status === 'inactive')).toBe(true);
	});

	it('filters by groupId', async () => {
		await seed({ groupId: 'group-xyz' });

		const result = await listUsers({ page: 1, limit: 20, groupId: 'group-xyz' });

		expect(result.items.every((u) => u.groupId === 'group-xyz')).toBe(true);
	});

	it('searches by firstName, lastName, and email', async () => {
		const unique = `Zephyrus-${crypto.randomUUID().slice(0, 6)}`;
		await seed({ firstName: unique });

		const result = await listUsers({ page: 1, limit: 10, search: unique });

		expect(result.items.some((u) => u.firstName === unique)).toBe(true);
	});

	it('returns empty result when no users match', async () => {
		const result = await listUsers({ page: 1, limit: 10, search: 'xyznonexistent999' });

		expect(result.items).toHaveLength(0);
		expect(result.total).toBe(0);
	});
});
