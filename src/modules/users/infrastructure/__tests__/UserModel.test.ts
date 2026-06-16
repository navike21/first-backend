import { describe, it, expect, beforeAll } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '../UserModel';

withMongo();
beforeAll(async () => {
	await UserModel.syncIndexes();
});

const baseUser = () => ({
	email: `test-${Date.now()}-${crypto.randomUUID().slice(0, 8)}@example.com`,
	password: 'hashed_password',
	firstName: 'John',
	lastName: 'Doe',
});

describe('UserModel', () => {
	it('creates a user with required fields and applies defaults', async () => {
		const user = await UserModel.create(baseUser());

		expect(user.id).toBeDefined();
		expect(user.email).toContain('@example.com');
		expect(user.isEmailVerified).toBe(false);
		expect(user.status).toBe('active');
		expect(user.presenceStatus).toBe('offline');
		expect(user.createdAt).toBeInstanceOf(Date);
	});

	it('lowercases and trims email on save', async () => {
		const user = await UserModel.create({
			...baseUser(),
			email: '  UPPER@EXAMPLE.COM  ',
		});

		expect(user.email).toBe('upper@example.com');
	});

	it('creates a user with all optional fields', async () => {
		const user = await UserModel.create({
			...baseUser(),
			phone: '+1234567890',
			groupIds: ['group-abc'],
			address: { street: '123 Main St', city: 'NY', country: 'US' },
			gender: 'male',
		});

		expect(user.phone).toBe('+1234567890');
		expect(user.groupIds).toEqual(['group-abc']);
		expect(user.address?.city).toBe('NY');
		expect(user.gender).toBe('male');
	});

	it('enforces unique email', async () => {
		const email = `unique-${crypto.randomUUID()}@test.com`;
		await UserModel.create({ ...baseUser(), email });
		await expect(UserModel.create({ ...baseUser(), email })).rejects.toThrow();
	});

	it('enforces unique id', async () => {
		const first = await UserModel.create(baseUser());
		await expect(
			UserModel.create({ ...baseUser(), id: first.id }),
		).rejects.toThrow();
	});

	it('rejects invalid gender enum', async () => {
		await expect(
			UserModel.create({ ...baseUser(), gender: 'invalid' }),
		).rejects.toThrow();
	});

	it('rejects invalid status enum', async () => {
		await expect(
			UserModel.create({ ...baseUser(), status: 'unknown' }),
		).rejects.toThrow();
	});

	it('rejects firstName shorter than 2 characters', async () => {
		await expect(
			UserModel.create({ ...baseUser(), firstName: 'J' }),
		).rejects.toThrow();
	});

	it('finds user by email', async () => {
		const email = `find-${Date.now()}@test.com`;
		await UserModel.create({ ...baseUser(), email });

		const found = await UserModel.findOne({ email });
		expect(found).not.toBeNull();
		expect(found!.email).toBe(email);
	});

	it('soft-deletes by updating status to deleted', async () => {
		const user = await UserModel.create(baseUser());
		await UserModel.updateOne({ id: user.id }, { status: 'deleted' });

		const updated = await UserModel.findOne({ id: user.id });
		expect(updated!.status).toBe('deleted');
	});

	it('sets isEmailVerified to true on update', async () => {
		const user = await UserModel.create(baseUser());
		expect(user.isEmailVerified).toBe(false);

		await UserModel.updateOne({ id: user.id }, { isEmailVerified: true });
		const updated = await UserModel.findOne({ id: user.id });
		expect(updated!.isEmailVerified).toBe(true);
	});
});
