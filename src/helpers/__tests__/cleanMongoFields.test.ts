import { describe, it, expect } from 'vitest';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

describe('cleanMongoFields', () => {
	it('strips _id and __v fields from a plain object', () => {
		// Arrange
		const input = { id: 'abc', name: 'Test', _id: 'mongo-id', __v: 0 };

		// Act
		const result = cleanMongoFields(input);

		// Assert
		expect(result).toEqual({ id: 'abc', name: 'Test' });
		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('__v');
	});

	it('returns a Date instance unchanged', () => {
		// Arrange
		const date = new Date('2024-01-01');

		// Act
		const result = cleanMongoFields(date);

		// Assert
		expect(result).toBe(date);
	});

	it('recursively cleans an array of objects', () => {
		// Arrange
		const input = [
			{ id: '1', name: 'A', _id: 'mongo-1' },
			{ id: '2', name: 'B', _id: 'mongo-2' },
		];

		// Act
		const result = cleanMongoFields(input);

		// Assert
		expect(result).toEqual([
			{ id: '1', name: 'A' },
			{ id: '2', name: 'B' },
		]);
	});

	it('returns primitives unchanged', () => {
		// Arrange & Act & Assert
		expect(cleanMongoFields('text')).toBe('text');
		expect(cleanMongoFields(42)).toBe(42);
		expect(cleanMongoFields(null)).toBeNull();
	});
});
