import { describe, it, expect } from 'vitest';
import { cartLocales } from '@Modules/cart/locales/index';

describe('cartLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(cartLocales).toBeDefined();
		expect(cartLocales.en).toBeDefined();
		expect(cartLocales.es).toBeDefined();
		expect(cartLocales.de).toBeDefined();
		expect(cartLocales.fr).toBeDefined();
		expect(cartLocales.it).toBeDefined();
		expect(cartLocales.ja).toBeDefined();
		expect(cartLocales.ko).toBeDefined();
		expect(cartLocales.pt).toBeDefined();
		expect(cartLocales.ru).toBeDefined();
		expect(cartLocales.zh).toBeDefined();
	});
});
