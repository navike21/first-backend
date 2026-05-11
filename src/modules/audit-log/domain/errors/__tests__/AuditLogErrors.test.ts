import { describe, it, expect } from 'vitest';
import { AUDIT_LOG_ERRORS } from '../AuditLogErrors';

describe('AUDIT_LOG_ERRORS', () => {
	it('has NOT_FOUND as a string value', () => {
		expect(AUDIT_LOG_ERRORS.NOT_FOUND).toBe('AUDIT_LOG_NOT_FOUND');
	});
});
