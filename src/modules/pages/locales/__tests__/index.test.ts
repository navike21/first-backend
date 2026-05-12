import { describe, it, expect } from 'vitest';
import { pagesLocales } from '@Modules/pages/locales/index';

describe('pagesLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(pagesLocales).toBeDefined();
		expect(typeof pagesLocales).toBe('object');
		expect(pagesLocales.en).toBeDefined();
		expect(pagesLocales.es).toBeDefined();
		expect(pagesLocales.de).toBeDefined();
		expect(pagesLocales.fr).toBeDefined();
		expect(pagesLocales.it).toBeDefined();
		expect(pagesLocales.ja).toBeDefined();
		expect(pagesLocales.ko).toBeDefined();
		expect(pagesLocales.pt).toBeDefined();
		expect(pagesLocales.ru).toBeDefined();
		expect(pagesLocales.zh).toBeDefined();
	});
});
