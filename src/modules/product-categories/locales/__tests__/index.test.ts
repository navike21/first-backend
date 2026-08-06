import { describe, it, expect } from 'vitest';
import { productCategoriesLocales } from '@Modules/product-categories/locales/index';

describe('productCategoriesLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(productCategoriesLocales).toBeDefined();
		expect(productCategoriesLocales.en).toBeDefined();
		expect(productCategoriesLocales.es).toBeDefined();
		expect(productCategoriesLocales.de).toBeDefined();
		expect(productCategoriesLocales.fr).toBeDefined();
		expect(productCategoriesLocales.it).toBeDefined();
		expect(productCategoriesLocales.ja).toBeDefined();
		expect(productCategoriesLocales.ko).toBeDefined();
		expect(productCategoriesLocales.pt).toBeDefined();
		expect(productCategoriesLocales.ru).toBeDefined();
		expect(productCategoriesLocales.zh).toBeDefined();
	});
});
