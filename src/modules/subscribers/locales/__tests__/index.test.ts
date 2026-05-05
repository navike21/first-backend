import { describe, it, expect } from 'vitest';
import { subscribersLocales } from '@Modules/subscribers/locales/index';

describe('subscribersLocales', () => {
	it('exports an object with locale keys', () => {
		expect(subscribersLocales).toBeDefined();
		expect(typeof subscribersLocales).toBe('object');
		expect(subscribersLocales.en).toBeDefined();
		expect(subscribersLocales.es).toBeDefined();
	});
});
