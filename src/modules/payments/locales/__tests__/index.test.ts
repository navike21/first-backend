import { describe, it, expect } from 'vitest';
import { paymentsLocales } from '@Modules/payments/locales/index';

describe('paymentsLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(paymentsLocales).toBeDefined();
		expect(paymentsLocales.en).toBeDefined();
		expect(paymentsLocales.es).toBeDefined();
		expect(paymentsLocales.de).toBeDefined();
		expect(paymentsLocales.fr).toBeDefined();
		expect(paymentsLocales.it).toBeDefined();
		expect(paymentsLocales.ja).toBeDefined();
		expect(paymentsLocales.ko).toBeDefined();
		expect(paymentsLocales.pt).toBeDefined();
		expect(paymentsLocales.ru).toBeDefined();
		expect(paymentsLocales.zh).toBeDefined();
	});
});
