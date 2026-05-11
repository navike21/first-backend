import { describe, it, expect } from 'vitest';
import AuditLogModel from '../AuditLogModel';

describe('AuditLogModel', () => {
	it('exports a Mongoose model', () => {
		expect(AuditLogModel).toBeDefined();
		expect(typeof AuditLogModel.find).toBe('function');
		expect(typeof AuditLogModel.findOne).toBe('function');
		expect(typeof AuditLogModel.create).toBe('function');
		expect(typeof AuditLogModel.countDocuments).toBe('function');
	});
});
