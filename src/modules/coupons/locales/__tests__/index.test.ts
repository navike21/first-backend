import { describe, it, expect } from 'vitest';
import { couponsLocales } from '@Modules/coupons/locales/index';

describe('couponsLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(couponsLocales).toBeDefined();
		expect(couponsLocales.en).toBeDefined();
		expect(couponsLocales.es).toBeDefined();
		expect(couponsLocales.de).toBeDefined();
		expect(couponsLocales.fr).toBeDefined();
		expect(couponsLocales.it).toBeDefined();
		expect(couponsLocales.ja).toBeDefined();
		expect(couponsLocales.ko).toBeDefined();
		expect(couponsLocales.pt).toBeDefined();
		expect(couponsLocales.ru).toBeDefined();
		expect(couponsLocales.zh).toBeDefined();
	});
});
