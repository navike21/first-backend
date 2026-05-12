import { describe, it, expect, beforeAll } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserGroupModel from '../UserGroupModel';

withMongo();

beforeAll(async () => {
	await UserGroupModel.syncIndexes();
});

const baseGroup = (suffix?: string) => ({
	name: `Test Group ${suffix ?? Date.now()}`,
	slug: `test-group-${suffix ?? Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
});

describe('UserGroupModel', () => {
	it('creates a group with required fields and applies defaults', async () => {
		const group = await UserGroupModel.create(baseGroup());

		expect(group.id).toBeDefined();
		expect(group.permissions).toEqual([]);
		expect(group.color).toBe('#6366f1');
		expect(group.isSystem).toBe(false);
		expect(group.status).toBe('active');
		expect(group.createdAt).toBeInstanceOf(Date);
	});

	it('creates a group with valid permissions', async () => {
		const group = await UserGroupModel.create({
			...baseGroup(),
			permissions: ['users:read', 'users:create', 'storage:upload'],
		});

		expect(group.permissions).toContain('users:read');
		expect(group.permissions).toContain('storage:upload');
	});

	it('creates a group with wildcard permission *:*', async () => {
		const group = await UserGroupModel.create({
			...baseGroup(),
			permissions: ['*:*'],
		});

		expect(group.permissions).toEqual(['*:*']);
	});

	it('rejects invalid permissions', async () => {
		await expect(
			UserGroupModel.create({
				...baseGroup(),
				permissions: ['not:a:valid:permission'],
			}),
		).rejects.toThrow();
	});

	it('enforces unique slug', async () => {
		const slug = `unique-slug-${Date.now()}`;
		await UserGroupModel.create({ ...baseGroup(), slug });
		await expect(
			UserGroupModel.create({ ...baseGroup(), slug }),
		).rejects.toThrow();
	});

	it('enforces unique id', async () => {
		const first = await UserGroupModel.create(baseGroup());
		await expect(
			UserGroupModel.create({ ...baseGroup(), id: first.id }),
		).rejects.toThrow();
	});

	it('rejects invalid color format', async () => {
		await expect(
			UserGroupModel.create({ ...baseGroup(), color: 'red' }),
		).rejects.toThrow();
	});

	it('accepts valid hex color', async () => {
		const group = await UserGroupModel.create({
			...baseGroup(),
			color: '#FF5733',
		});

		expect(group.color).toBe('#FF5733');
	});

	it('rejects invalid status enum', async () => {
		await expect(
			UserGroupModel.create({ ...baseGroup(), status: 'unknown' }),
		).rejects.toThrow();
	});

	it('finds group by slug', async () => {
		const slug = `findable-slug-${Date.now()}`;
		await UserGroupModel.create({ ...baseGroup(), slug });

		const found = await UserGroupModel.findOne({ slug });
		expect(found).not.toBeNull();
		expect(found!.slug).toBe(slug);
	});

	it('updates permissions correctly', async () => {
		const group = await UserGroupModel.create(baseGroup());
		expect(group.permissions).toEqual([]);

		await UserGroupModel.updateOne(
			{ id: group.id },
			{ permissions: ['users:read'] },
		);

		const updated = await UserGroupModel.findOne({ id: group.id });
		expect(updated!.permissions).toEqual(['users:read']);
	});

	it('marks group as system', async () => {
		const group = await UserGroupModel.create({
			...baseGroup(),
			isSystem: true,
		});

		expect(group.isSystem).toBe(true);
	});
});
