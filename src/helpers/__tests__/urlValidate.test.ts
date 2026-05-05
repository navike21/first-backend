import { describe, it, expect } from 'vitest';
import { urlValidate } from '@Helpers/urlValidate';

describe('urlValidate', () => {
	it('accepts an http URL', () => {
		// Arrange
		const url = 'http://example.com';

		// Act
		const result = urlValidate(url);

		// Assert
		expect(result).toBe(true);
	});

	it('accepts an https URL with path', () => {
		// Arrange
		const url = 'https://example.com/path';

		// Act
		const result = urlValidate(url);

		// Assert
		expect(result).toBe(true);
	});

	it('accepts a domain without protocol', () => {
		// Arrange
		const url = 'example.com';

		// Act
		const result = urlValidate(url);

		// Assert
		expect(result).toBe(true);
	});

	it('accepts an IPv4 address', () => {
		// Arrange
		const url = '192.168.1.1';

		// Act
		const result = urlValidate(url);

		// Assert
		expect(result).toBe(true);
	});

	it('rejects a non-URL string', () => {
		// Arrange
		const url = 'not-a-url';

		// Act
		const result = urlValidate(url);

		// Assert
		expect(result).toBe(false);
	});
});
