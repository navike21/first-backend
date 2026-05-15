import { describe, it, expect } from 'vitest';
import { AUDIT_ACTIONS } from '../auditActions';

describe('AUDIT_ACTIONS', () => {
	it('contains auth actions', () => {
		expect(AUDIT_ACTIONS.AUTH_LOGIN).toBe('auth:login');
		expect(AUDIT_ACTIONS.AUTH_LOGOUT).toBe('auth:logout');
		expect(AUDIT_ACTIONS.AUTH_PASSWORD_CHANGED).toBe('auth:password_changed');
		expect(AUDIT_ACTIONS.AUTH_PASSWORD_RESET).toBe('auth:password_reset');
		expect(AUDIT_ACTIONS.AUTH_EMAIL_VERIFIED).toBe('auth:email_verified');
	});

	it('contains user actions', () => {
		expect(AUDIT_ACTIONS.USERS_CREATED).toBe('users:created');
		expect(AUDIT_ACTIONS.USERS_UPDATED).toBe('users:updated');
		expect(AUDIT_ACTIONS.USERS_DELETED).toBe('users:deleted');
	});

	it('contains subscriber actions', () => {
		expect(AUDIT_ACTIONS.SUBSCRIBERS_CREATED).toBe('subscribers:created');
		expect(AUDIT_ACTIONS.SUBSCRIBERS_UPDATED).toBe('subscribers:updated');
		expect(AUDIT_ACTIONS.SUBSCRIBERS_DELETED).toBe('subscribers:deleted');
	});

	it('contains storage actions', () => {
		expect(AUDIT_ACTIONS.STORAGE_UPLOADED).toBe('storage:uploaded');
		expect(AUDIT_ACTIONS.STORAGE_SOFT_DELETED).toBe('storage:soft_deleted');
		expect(AUDIT_ACTIONS.STORAGE_PERMANENTLY_DELETED).toBe(
			'storage:permanently_deleted',
		);
	});

	it('contains user group actions', () => {
		expect(AUDIT_ACTIONS.USER_GROUPS_CREATED).toBe('user-groups:created');
		expect(AUDIT_ACTIONS.USER_GROUPS_UPDATED).toBe('user-groups:updated');
		expect(AUDIT_ACTIONS.USER_GROUPS_DELETED).toBe('user-groups:deleted');
	});
});
