import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createAuditEntry } from '../createAuditEntry';
import AuditLogModel from '../../infrastructure/AuditLogModel';

withMongo();

describe('createAuditEntry', () => {
	it('persists an entry in the database', async () => {
		await createAuditEntry({
			action: 'auth:login',
			resource: 'auth',
			userId: 'user-1',
			ipAddress: '127.0.0.1',
			userAgent: 'Test/1.0',
		});

		const found = await AuditLogModel.findOne({
			action: 'auth:login',
			userId: 'user-1',
		});

		expect(found).not.toBeNull();
		expect(found!.resource).toBe('auth');
		expect(found!.ipAddress).toBe('127.0.0.1');
		expect(found!.id).toBeDefined();
		expect(found!.occurredAt).toBeInstanceOf(Date);
	});

	it('persists an entry without optional fields', async () => {
		await createAuditEntry({ action: 'storage:upload', resource: 'storage' });

		const found = await AuditLogModel.findOne({ action: 'storage:upload' });

		expect(found).not.toBeNull();
		expect(found!.userId).toBeUndefined();
		expect(found!.ipAddress).toBeUndefined();
	});

	it('persists metadata correctly', async () => {
		await createAuditEntry({
			action: 'users:create',
			resource: 'users',
			resourceId: 'u-abc',
			metadata: { email: 'test@example.com', role: 'admin' },
		});

		const found = await AuditLogModel.findOne({ resourceId: 'u-abc' });

		expect(found!.metadata).toEqual({
			email: 'test@example.com',
			role: 'admin',
		});
	});

	it('creates multiple entries independently', async () => {
		await createAuditEntry({ action: 'a', resource: 'r', userId: 'bulk-u' });
		await createAuditEntry({ action: 'b', resource: 'r', userId: 'bulk-u' });
		await createAuditEntry({ action: 'c', resource: 'r', userId: 'bulk-u' });

		const count = await AuditLogModel.countDocuments({ userId: 'bulk-u' });
		expect(count).toBe(3);
	});
});
