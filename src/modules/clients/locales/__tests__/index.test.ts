import { describe, it, expect } from 'vitest';
import { clientsLocales } from '@Modules/clients/locales/index';

describe('clientsLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(clientsLocales).toBeDefined();
		expect(typeof clientsLocales).toBe('object');
		expect(clientsLocales.en).toBeDefined();
		expect(clientsLocales.es).toBeDefined();
		expect(clientsLocales.de).toBeDefined();
		expect(clientsLocales.fr).toBeDefined();
		expect(clientsLocales.it).toBeDefined();
		expect(clientsLocales.ja).toBeDefined();
		expect(clientsLocales.ko).toBeDefined();
		expect(clientsLocales.pt).toBeDefined();
		expect(clientsLocales.ru).toBeDefined();
		expect(clientsLocales.zh).toBeDefined();
	});
});
