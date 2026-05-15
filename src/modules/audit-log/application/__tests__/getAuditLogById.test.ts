import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { getAuditLogById } from '../getAuditLogById';
import { createAuditEntry } from '../createAuditEntry';
import AuditLogModel from '../../infrastructure/AuditLogModel';
import { AUDIT_LOG_ERRORS } from '../../domain/errors/AuditLogErrors';

withMongo();

describe('getAuditLogById', () => {
	it('returns the log when found', async () => {
		await createAuditEntry({
			action: 'auth:login',
			resource: 'auth',
			userId: 'u1',
			ipAddress: '1.2.3.4',
		});

		const doc = await AuditLogModel.findOne({ action: 'auth:login' });
		const result = await getAuditLogById(doc!.id);

		expect(result).toBeDefined();
		expect(result.action).toBe('auth:login');
		expect(result.resource).toBe('auth');
		expect(result.userId).toBe('u1');
	});

	it('strips _id and __v from returned log', async () => {
		await createAuditEntry({ action: 'users:create', resource: 'users' });
		const doc = await AuditLogModel.findOne({ action: 'users:create' });

		const result = await getAuditLogById(doc!.id);

		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('__v');
	});

	it('throws AUDIT_LOG_NOT_FOUND when log does not exist', async () => {
		await expect(getAuditLogById('nonexistent-id')).rejects.toMatchObject({
			statusCode: 404,
			code: AUDIT_LOG_ERRORS.NOT_FOUND,
		});
	});
});
