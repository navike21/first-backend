import { describe, it, expect } from 'vitest';
import {
	hasPermission,
	PERMISSIONS,
	SUPER_ADMIN_PERMISSIONS,
} from '@Constants/permissions';

describe('hasPermission', () => {
	it('returns true when user has wildcard *:* permission', () => {
		// Arrange
		const perms = [PERMISSIONS.ALL];

		// Act & Assert
		expect(hasPermission(perms, PERMISSIONS.USERS_READ)).toBe(true);
	});

	it('returns true when user has resource:manage for the required resource', () => {
		// Arrange
		const perms = [PERMISSIONS.USERS_MANAGE];

		// Act & Assert
		expect(hasPermission(perms, PERMISSIONS.USERS_READ)).toBe(true);
	});

	it('returns true when user has the exact required permission', () => {
		// Arrange
		const perms = [PERMISSIONS.USERS_READ];

		// Act & Assert
		expect(hasPermission(perms, PERMISSIONS.USERS_READ)).toBe(true);
	});

	it('returns false when user lacks the required permission', () => {
		// Arrange
		const perms = [PERMISSIONS.SUBSCRIBERS_READ];

		// Act & Assert
		expect(hasPermission(perms, PERMISSIONS.USERS_READ)).toBe(false);
	});

	it('returns false when user has an empty permissions list', () => {
		// Arrange
		const perms: string[] = [];

		// Act & Assert
		expect(hasPermission(perms, PERMISSIONS.USERS_DELETE)).toBe(false);
	});

	it('manage permission for one resource does not grant access to another', () => {
		// Arrange
		const perms = [PERMISSIONS.USERS_MANAGE];

		// Act & Assert
		expect(hasPermission(perms, PERMISSIONS.SUBSCRIBERS_READ)).toBe(false);
	});

	it('manage does NOT grant purge (physical destruction needs explicit :purge)', () => {
		expect(
			hasPermission([PERMISSIONS.USERS_MANAGE], PERMISSIONS.USERS_PURGE),
		).toBe(false);
	});

	it('explicit :purge grants purge', () => {
		expect(
			hasPermission([PERMISSIONS.USERS_PURGE], PERMISSIONS.USERS_PURGE),
		).toBe(true);
	});

	it('the *:* super-root permission grants purge', () => {
		expect(hasPermission([PERMISSIONS.ALL], PERMISSIONS.USERS_PURGE)).toBe(
			true,
		);
	});
});

describe('SUPER_ADMIN_PERMISSIONS', () => {
	it('grants full access except physical destruction (no :purge, no *:*)', () => {
		expect(SUPER_ADMIN_PERMISSIONS).not.toContain(PERMISSIONS.ALL);
		expect(SUPER_ADMIN_PERMISSIONS.some((p) => p.endsWith(':purge'))).toBe(
			false,
		);
		// can manage users (full CRUD) but cannot purge them
		expect(
			hasPermission(SUPER_ADMIN_PERMISSIONS, PERMISSIONS.USERS_DELETE),
		).toBe(true);
		expect(
			hasPermission(SUPER_ADMIN_PERMISSIONS, PERMISSIONS.USERS_PURGE),
		).toBe(false);
	});
});
