import { describe, it, expect } from 'vitest';
import { passwordResetTemplate } from '@Modules/notifications-email/templates/passwordReset.template';

describe('passwordResetTemplate', () => {
	it('returns an object with subject and html properties', () => {
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com/reset?token=abc',
		});

		expect(result).toHaveProperty('subject');
		expect(result).toHaveProperty('html');
	});

	it('includes the firstName in the html output', () => {
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com',
		});

		expect(result.html).toContain('Alice');
	});

	it('includes the resetUrl in the html output', () => {
		const resetUrl = 'https://example.com/reset?token=xyz';

		const result = passwordResetTemplate({ firstName: 'Bob', resetUrl });

		expect(result.html).toContain(resetUrl);
	});

	it('defaults to English when no lang is provided', () => {
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com',
		});

		expect(result.subject).toBe('Reset your password');
	});

	it('returns Spanish subject when lang is es', () => {
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com',
			lang: 'es',
		});

		expect(result.subject).toBe('Restablece tu contraseña');
	});

	it('includes the firstName in the heading for the given language', () => {
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com',
			lang: 'fr',
		});

		expect(result.html).toContain('Alice');
		expect(result.html).toContain('Bonjour');
	});

	it('falls back to English for unsupported language', () => {
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com',
			lang: 'xx',
		});

		expect(result.subject).toBe('Reset your password');
	});

	it('sets the html lang attribute to the provided language', () => {
		const result = passwordResetTemplate({
			firstName: 'Alice',
			resetUrl: 'https://example.com',
			lang: 'ko',
		});

		expect(result.html).toContain('lang="ko"');
	});
});
