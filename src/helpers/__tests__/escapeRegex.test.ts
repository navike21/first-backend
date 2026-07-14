import { describe, it, expect } from 'vitest';
import { escapeRegex } from '@Helpers/escapeRegex';

describe('escapeRegex', () => {
	it('returns a plain alphanumeric string unchanged', () => {
		// Arrange
		const value = 'acme corp';

		// Act
		const result = escapeRegex(value);

		// Assert
		expect(result).toBe('acme corp');
	});

	it('escapes every regex-significant character', () => {
		// Arrange
		const value = '.*+?^${}()|[]\\';

		// Act
		const result = escapeRegex(value);

		// Assert
		expect(result).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
	});

	it('neutralizes a catastrophic-backtracking pattern as a literal match', () => {
		// Arrange
		const value = '(a+)+$';

		// Act
		const escaped = escapeRegex(value);
		const matches = new RegExp(escaped).test('(a+)+$');
		const doesNotMatchUnescapedInput = new RegExp(escaped).test('aaaaaaaaaa');

		// Assert
		expect(matches).toBe(true);
		expect(doesNotMatchUnescapedInput).toBe(false);
	});
});
