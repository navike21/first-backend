import { describe, it, expect } from 'vitest';
import { isValidISODateString } from '@Helpers/isValidISODateString';

describe('isValidISODateString', () => {
	it('returns true for a valid ISO date string', () => {
		// Arrange & Act & Assert
		expect(isValidISODateString('2024-06-15')).toBe(true);
	});

	it('returns true for a valid ISO datetime string', () => {
		// Arrange & Act & Assert
		expect(isValidISODateString('2024-06-15T10:30:00.000Z')).toBe(true);
	});

	it('returns false for undefined', () => {
		// Arrange & Act & Assert
		expect(isValidISODateString(undefined)).toBe(false);
	});

	it('returns false for an empty string', () => {
		// Arrange & Act & Assert
		expect(isValidISODateString('')).toBe(false);
	});

	it('returns false for a non-date string', () => {
		// Arrange & Act & Assert
		expect(isValidISODateString('not-a-date')).toBe(false);
	});

	it('returns false for a non-string value', () => {
		// Arrange & Act & Assert
		expect(isValidISODateString(123 as unknown as string)).toBe(false);
	});
});
