import { describe, it, expect } from 'vitest';
import { welcomeEmailTemplate } from '@Modules/notifications-email/templates/welcomeEmail.template';

describe('welcomeEmailTemplate', () => {
	it('returns an object with subject and html properties', () => {
		// Arrange & Act
		const result = welcomeEmailTemplate({ firstName: 'Alice' });

		// Assert
		expect(result).toHaveProperty('subject');
		expect(result).toHaveProperty('html');
	});

	it('includes the firstName in the html output', () => {
		// Arrange & Act
		const result = welcomeEmailTemplate({ firstName: 'Alice' });

		// Assert
		expect(result.html).toContain('Alice');
	});

	it('returns a non-empty subject', () => {
		// Arrange & Act
		const result = welcomeEmailTemplate({ firstName: 'Bob' });

		// Assert
		expect(result.subject.length).toBeGreaterThan(0);
	});
});
