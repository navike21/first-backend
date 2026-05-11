import { describe, it, expect } from 'vitest';
import { verifyEmailTemplate } from '@Modules/notifications-email/templates/verifyEmail.template';

describe('verifyEmailTemplate', () => {
	it('returns an object with subject and html properties', () => {
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com/verify?token=abc',
		});

		expect(result).toHaveProperty('subject');
		expect(result).toHaveProperty('html');
	});

	it('includes the firstName in the html output', () => {
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com/verify',
		});

		expect(result.html).toContain('Alice');
	});

	it('includes the verificationUrl in the html output', () => {
		const verificationUrl = 'https://example.com/verify?token=xyz';

		const result = verifyEmailTemplate({ firstName: 'Bob', verificationUrl });

		expect(result.html).toContain(verificationUrl);
	});

	it('defaults to English when no lang is provided', () => {
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com',
		});

		expect(result.subject).toBe('Verify your email address');
	});

	it('returns Spanish subject when lang is es', () => {
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com',
			lang: 'es',
		});

		expect(result.subject).toBe('Verifica tu dirección de correo electrónico');
	});

	it('includes the firstName in the heading for the given language', () => {
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com',
			lang: 'de',
		});

		expect(result.html).toContain('Alice');
		expect(result.html).toContain('Hallo');
	});

	it('falls back to English for unsupported language', () => {
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com',
			lang: 'xx',
		});

		expect(result.subject).toBe('Verify your email address');
	});

	it('sets the html lang attribute to the provided language', () => {
		const result = verifyEmailTemplate({
			firstName: 'Alice',
			verificationUrl: 'https://example.com',
			lang: 'ja',
		});

		expect(result.html).toContain('lang="ja"');
	});
});
