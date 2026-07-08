import { describe, it, expect } from 'vitest';
import { categoriesLocales } from '@Modules/categories/locales/index';

describe('categoriesLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(categoriesLocales).toBeDefined();
		expect(categoriesLocales.en).toBeDefined();
		expect(categoriesLocales.es).toBeDefined();
		expect(categoriesLocales.de).toBeDefined();
		expect(categoriesLocales.fr).toBeDefined();
		expect(categoriesLocales.it).toBeDefined();
		expect(categoriesLocales.ja).toBeDefined();
		expect(categoriesLocales.ko).toBeDefined();
		expect(categoriesLocales.pt).toBeDefined();
		expect(categoriesLocales.ru).toBeDefined();
		expect(categoriesLocales.zh).toBeDefined();
	});
});
