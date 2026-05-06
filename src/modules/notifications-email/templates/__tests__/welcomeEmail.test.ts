import { describe, it, expect } from 'vitest';
import { welcomeEmailTemplate } from '@Modules/notifications-email/templates/welcomeEmail.template';

describe('welcomeEmailTemplate', () => {
	it('returns an object with subject and html properties', () => {
		const result = welcomeEmailTemplate({ firstName: 'Alice' });

		expect(result).toHaveProperty('subject');
		expect(result).toHaveProperty('html');
	});

	it('includes the firstName in the html output', () => {
		const result = welcomeEmailTemplate({ firstName: 'Alice' });

		expect(result.html).toContain('Alice');
	});

	it('returns a non-empty subject', () => {
		const result = welcomeEmailTemplate({ firstName: 'Bob' });

		expect(result.subject.length).toBeGreaterThan(0);
	});

	it('defaults to English when no lang is provided', () => {
		const result = welcomeEmailTemplate({ firstName: 'Alice' });

		expect(result.subject).toBe('Welcome to First Backend!');
	});

	it('returns Spanish subject when lang is es', () => {
		const result = welcomeEmailTemplate({ firstName: 'Alice', lang: 'es' });

		expect(result.subject).toBe('¡Bienvenido a First Backend!');
	});

	it('includes the firstName in the heading for the given language', () => {
		const result = welcomeEmailTemplate({ firstName: 'Alice', lang: 'fr' });

		expect(result.html).toContain('Alice');
		expect(result.html).toContain('Bienvenue');
	});

	it('falls back to English for unsupported language', () => {
		const result = welcomeEmailTemplate({ firstName: 'Alice', lang: 'xx' });

		expect(result.subject).toBe('Welcome to First Backend!');
	});

	it('sets the html lang attribute to the provided language', () => {
		const result = welcomeEmailTemplate({ firstName: 'Alice', lang: 'de' });

		expect(result.html).toContain('lang="de"');
	});
});
