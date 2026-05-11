import { describe, it, expect } from 'vitest';
import { hasPermission, PERMISSIONS } from '@Constants/permissions';

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
});
