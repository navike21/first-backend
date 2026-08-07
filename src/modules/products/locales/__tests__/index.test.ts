import { describe, it, expect } from 'vitest';
import { productsLocales } from '@Modules/products/locales/index';

describe('productsLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(productsLocales).toBeDefined();
		expect(productsLocales.en).toBeDefined();
		expect(productsLocales.es).toBeDefined();
		expect(productsLocales.de).toBeDefined();
		expect(productsLocales.fr).toBeDefined();
		expect(productsLocales.it).toBeDefined();
		expect(productsLocales.ja).toBeDefined();
		expect(productsLocales.ko).toBeDefined();
		expect(productsLocales.pt).toBeDefined();
		expect(productsLocales.ru).toBeDefined();
		expect(productsLocales.zh).toBeDefined();
	});
});
