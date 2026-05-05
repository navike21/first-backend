import { describe, it, expect } from 'vitest';
import { passwordResetTemplate } from '@Modules/notifications/templates/passwordReset.template';

describe('passwordResetTemplate', () => {
	it('returns an object with subject and html properties', () => {
		// Arrange & Act
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com/reset?token=abc',
		});

		// Assert
		expect(result).toHaveProperty('subject');
		expect(result).toHaveProperty('html');
	});

	it('includes the firstName in the html output', () => {
		// Arrange & Act
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com',
		});

		// Assert
		expect(result.html).toContain('Alice');
	});

	it('includes the resetUrl in the html output', () => {
		// Arrange
		const resetUrl = 'https://example.com/reset?token=xyz';

		// Act
		const result = passwordResetTemplate({ firstName: 'Bob', resetUrl });

		// Assert
		expect(result.html).toContain(resetUrl);
	});
});
