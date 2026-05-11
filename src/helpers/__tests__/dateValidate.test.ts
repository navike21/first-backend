import { describe, it, expect } from 'vitest';
import { dateValidate } from '@Helpers/dateValidate';

describe('dateValidate', () => {
	it('returns true for a valid Date', () => {
		// Arrange
		const date = new Date('2024-06-15');

		// Act
		const result = dateValidate(date);

		// Assert
		expect(result).toBe(true);
	});

	it('returns true when date is falsy (empty value allowed)', () => {
		// Arrange & Act
		const result = dateValidate(null as unknown as Date);

		// Assert
		expect(result).toBe(true);
	});

	it('returns false for an invalid Date', () => {
		// Arrange
		const date = new Date('not-a-date');

		// Act
		const result = dateValidate(date);

		// Assert
		expect(result).toBe(false);
	});
});
