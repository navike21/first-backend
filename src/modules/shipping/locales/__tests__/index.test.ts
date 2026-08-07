import { describe, it, expect } from 'vitest';
import { shippingLocales } from '@Modules/shipping/locales/index';

describe('shippingLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(shippingLocales).toBeDefined();
		expect(shippingLocales.en).toBeDefined();
		expect(shippingLocales.es).toBeDefined();
		expect(shippingLocales.de).toBeDefined();
		expect(shippingLocales.fr).toBeDefined();
		expect(shippingLocales.it).toBeDefined();
		expect(shippingLocales.ja).toBeDefined();
		expect(shippingLocales.ko).toBeDefined();
		expect(shippingLocales.pt).toBeDefined();
		expect(shippingLocales.ru).toBeDefined();
		expect(shippingLocales.zh).toBeDefined();
	});
});
