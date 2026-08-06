import { describe, it, expect } from 'vitest';
import { customersLocales } from '@Modules/customers/locales/index';

describe('customersLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(customersLocales).toBeDefined();
		expect(customersLocales.en).toBeDefined();
		expect(customersLocales.es).toBeDefined();
		expect(customersLocales.de).toBeDefined();
		expect(customersLocales.fr).toBeDefined();
		expect(customersLocales.it).toBeDefined();
		expect(customersLocales.ja).toBeDefined();
		expect(customersLocales.ko).toBeDefined();
		expect(customersLocales.pt).toBeDefined();
		expect(customersLocales.ru).toBeDefined();
		expect(customersLocales.zh).toBeDefined();
	});
});
