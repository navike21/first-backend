import { describe, it, expect } from 'vitest';
import { servicesLocales } from '@Modules/services/locales/index';

describe('servicesLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(servicesLocales).toBeDefined();
		expect(typeof servicesLocales).toBe('object');
		expect(servicesLocales.en).toBeDefined();
		expect(servicesLocales.es).toBeDefined();
		expect(servicesLocales.zh).toBeDefined();
	});
});
