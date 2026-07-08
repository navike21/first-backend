import { describe, it, expect } from 'vitest';
import { tagsLocales } from '@Modules/tags/locales/index';

describe('tagsLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(tagsLocales).toBeDefined();
		expect(tagsLocales.en).toBeDefined();
		expect(tagsLocales.es).toBeDefined();
		expect(tagsLocales.de).toBeDefined();
		expect(tagsLocales.fr).toBeDefined();
		expect(tagsLocales.it).toBeDefined();
		expect(tagsLocales.ja).toBeDefined();
		expect(tagsLocales.ko).toBeDefined();
		expect(tagsLocales.pt).toBeDefined();
		expect(tagsLocales.ru).toBeDefined();
		expect(tagsLocales.zh).toBeDefined();
	});
});
