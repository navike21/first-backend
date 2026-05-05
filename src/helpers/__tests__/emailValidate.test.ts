import { describe, it, expect } from 'vitest';
import { emailValidate } from '@Helpers/emailValidate';

describe('emailValidate', () => {
	it('accepts a valid email address', () => {
		// Arrange & Act & Assert
		expect(emailValidate('user@example.com')).toBe(true);
	});

	it('accepts an email with subdomain', () => {
		// Arrange & Act & Assert
		expect(emailValidate('user@mail.example.com')).toBe(true);
	});

	it('rejects an email without @ symbol', () => {
		// Arrange & Act & Assert
		expect(emailValidate('userexample.com')).toBe(false);
	});

	it('rejects an email without domain', () => {
		// Arrange & Act & Assert
		expect(emailValidate('user@')).toBe(false);
	});

	it('rejects an email with spaces', () => {
		// Arrange & Act & Assert
		expect(emailValidate('user @example.com')).toBe(false);
	});

	it('rejects an empty string', () => {
		// Arrange & Act & Assert
		expect(emailValidate('')).toBe(false);
	});
});
