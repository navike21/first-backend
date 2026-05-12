import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserGroupModel from '@Modules/user-groups/infrastructure/UserGroupModel';
import { listUserGroups } from '@Modules/user-groups/application/listUserGroups';

withMongo();

const seed = (overrides = {}) =>
	UserGroupModel.create({
		name: `Group ${crypto.randomUUID().slice(0, 8)}`,
		slug: `group-${crypto.randomUUID().slice(0, 8)}`,
		...overrides,
	});

describe('listUserGroups', () => {
	it('returns all groups with pagination metadata', async () => {
		await Promise.all([seed(), seed(), seed()]);

		const result = await listUserGroups({ page: 1, limit: 10 });

		expect(result.items.length).toBeGreaterThanOrEqual(3);
		expect(result.total).toBeGreaterThanOrEqual(3);
		expect(result.page).toBe(1);
		expect(result.limit).toBe(10);
		expect(result.pages).toBeGreaterThanOrEqual(1);
	});

	it('paginates correctly', async () => {
		await Promise.all([seed(), seed(), seed(), seed(), seed()]);

		const page1 = await listUserGroups({ page: 1, limit: 2 });
		const page2 = await listUserGroups({ page: 2, limit: 2 });

		expect(page1.items).toHaveLength(2);
		expect(page2.items.length).toBeGreaterThanOrEqual(1);
		expect(page1.items[0].id).not.toBe(page2.items[0].id);
	});

	it('filters by status', async () => {
		await seed({ status: 'inactive' });
		await seed({ status: 'active' });

		const result = await listUserGroups({ page: 1, limit: 20, status: 'inactive' });

		expect(result.items.every((g) => g.status === 'inactive')).toBe(true);
	});

	it('filters by name search (case-insensitive)', async () => {
		const uniqueName = `Zephyr-${crypto.randomUUID().slice(0, 6)}`;
		await seed({ name: uniqueName, slug: uniqueName.toLowerCase() });

		const result = await listUserGroups({ page: 1, limit: 10, search: 'Zephyr' });

		expect(result.items.some((g) => g.name === uniqueName)).toBe(true);
	});

	it('returns empty list when no groups match', async () => {
		const result = await listUserGroups({ page: 1, limit: 10, search: 'xyznonexistent999' });

		expect(result.items).toHaveLength(0);
		expect(result.total).toBe(0);
	});
});
