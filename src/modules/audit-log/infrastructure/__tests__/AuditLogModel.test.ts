import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import AuditLogModel from '../AuditLogModel';

withMongo();

describe('AuditLogModel', () => {
	it('creates a document with required fields', async () => {
		const doc = await AuditLogModel.create({
			action: 'auth:login',
			resource: 'auth',
		});

		expect(doc.id).toBeDefined();
		expect(doc.action).toBe('auth:login');
		expect(doc.resource).toBe('auth');
		expect(doc.occurredAt).toBeInstanceOf(Date);
	});

	it('creates a document with all optional fields', async () => {
		const doc = await AuditLogModel.create({
			action: 'users:create',
			resource: 'users',
			resourceId: 'user-123',
			userId: 'u-abc',
			ipAddress: '1.2.3.4',
			userAgent: 'Mozilla/5.0',
			metadata: { role: 'admin' },
		});

		expect(doc.userId).toBe('u-abc');
		expect(doc.resourceId).toBe('user-123');
		expect(doc.ipAddress).toBe('1.2.3.4');
		expect(doc.metadata).toEqual({ role: 'admin' });
	});

	it('fails without required field action', async () => {
		await expect(AuditLogModel.create({ resource: 'auth' })).rejects.toThrow();
	});

	it('fails without required field resource', async () => {
		await expect(
			AuditLogModel.create({ action: 'auth:login' }),
		).rejects.toThrow();
	});

	it('enforces unique id', async () => {
		const first = await AuditLogModel.create({ action: 'x', resource: 'y' });
		await expect(
			AuditLogModel.create({ id: first.id, action: 'x', resource: 'y' }),
		).rejects.toThrow();
	});

	it('finds documents by userId', async () => {
		await AuditLogModel.create({ action: 'a', resource: 'r', userId: 'u1' });
		await AuditLogModel.create({ action: 'b', resource: 'r', userId: 'u1' });
		await AuditLogModel.create({ action: 'c', resource: 'r', userId: 'u2' });

		const results = await AuditLogModel.find({ userId: 'u1' });
		expect(results).toHaveLength(2);
	});

	it('finds documents by resource', async () => {
		await AuditLogModel.create({ action: 'create', resource: 'storage' });
		await AuditLogModel.create({ action: 'delete', resource: 'storage' });

		const results = await AuditLogModel.find({ resource: 'storage' });
		expect(results).toHaveLength(2);
	});

	it('counts documents correctly', async () => {
		await AuditLogModel.create({ action: 'a', resource: 'r' });
		await AuditLogModel.create({ action: 'b', resource: 'r' });

		const count = await AuditLogModel.countDocuments();
		expect(count).toBe(2);
	});
});
