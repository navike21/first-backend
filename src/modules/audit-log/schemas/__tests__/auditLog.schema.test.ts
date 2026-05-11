import { describe, it, expect } from 'vitest';
import { AuditLogQuerySchema } from '../auditLog.schema';

describe('AuditLogQuerySchema', () => {
	it('parses empty input with defaults', () => {
		const result = AuditLogQuerySchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(20);
		}
	});

	it('parses all optional string filters', () => {
		const result = AuditLogQuerySchema.safeParse({
			userId: 'u1',
			action: 'auth:login',
			resource: 'auth',
			dateFrom: '2024-01-01T00:00:00Z',
			dateTo: '2024-12-31T23:59:59Z',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.userId).toBe('u1');
			expect(result.data.action).toBe('auth:login');
			expect(result.data.resource).toBe('auth');
			expect(result.data.dateFrom).toBe('2024-01-01T00:00:00Z');
			expect(result.data.dateTo).toBe('2024-12-31T23:59:59Z');
		}
	});

	it('coerces page and limit from strings', () => {
		const result = AuditLogQuerySchema.safeParse({ page: '3', limit: '50' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(3);
			expect(result.data.limit).toBe(50);
		}
	});

	it('fails when page is 0', () => {
		const result = AuditLogQuerySchema.safeParse({ page: '0' });
		expect(result.success).toBe(false);
	});

	it('fails when limit exceeds 100', () => {
		const result = AuditLogQuerySchema.safeParse({ limit: '101' });
		expect(result.success).toBe(false);
	});

	it('fails when page is not a number', () => {
		const result = AuditLogQuerySchema.safeParse({ page: 'abc' });
		expect(result.success).toBe(false);
	});
});
