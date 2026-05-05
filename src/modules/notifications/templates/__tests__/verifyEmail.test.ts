import { describe, it, expect } from 'vitest';
import { verifyEmailTemplate } from '@Modules/notifications/templates/verifyEmail.template';

describe('verifyEmailTemplate', () => {
	it('returns an object with subject and html properties', () => {
		// Arrange & Act
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com/verify?token=abc',
		});

		// Assert
		expect(result).toHaveProperty('subject');
		expect(result).toHaveProperty('html');
	});

	it('includes the firstName in the html output', () => {
		// Arrange & Act
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com/verify',
		});

		// Assert
		expect(result.html).toContain('Alice');
	});

	it('includes the verificationUrl in the html output', () => {
		// Arrange
		const verificationUrl = 'https://example.com/verify?token=xyz';

		// Act
		const result = verifyEmailTemplate({ firstName: 'Bob', verificationUrl });

		// Assert
		expect(result.html).toContain(verificationUrl);
	});
});
