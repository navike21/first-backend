import { describe, it, expect } from 'vitest';
import generateUUID from '@Helpers/uuid';

describe('generateUUID', () => {
	it('returns a string', () => {
		// Arrange & Act
		const result = generateUUID();

		// Assert
		expect(typeof result).toBe('string');
	});

	it('returns a valid UUID v4 format', () => {
		// Arrange
		const uuidPattern =
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		// Act
		const result = generateUUID();

		// Assert
		expect(uuidPattern.test(result)).toBe(true);
	});

	it('generates unique values on each call', () => {
		// Arrange & Act
		const first = generateUUID();
		const second = generateUUID();

		// Assert
		expect(first).not.toBe(second);
	});
});
