import { describe, it, expect } from 'vitest';
import { customerAuthLocales } from '@Modules/customer-auth/locales/index';

describe('customerAuthLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(customerAuthLocales).toBeDefined();
		expect(customerAuthLocales.en).toBeDefined();
		expect(customerAuthLocales.es).toBeDefined();
		expect(customerAuthLocales.de).toBeDefined();
		expect(customerAuthLocales.fr).toBeDefined();
		expect(customerAuthLocales.it).toBeDefined();
		expect(customerAuthLocales.ja).toBeDefined();
		expect(customerAuthLocales.ko).toBeDefined();
		expect(customerAuthLocales.pt).toBeDefined();
		expect(customerAuthLocales.ru).toBeDefined();
		expect(customerAuthLocales.zh).toBeDefined();
	});
});
