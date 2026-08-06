import { describe, it, expect } from 'vitest';
import { inventoryLocales } from '@Modules/inventory/locales/index';

describe('inventoryLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(inventoryLocales).toBeDefined();
		expect(inventoryLocales.en).toBeDefined();
		expect(inventoryLocales.es).toBeDefined();
		expect(inventoryLocales.de).toBeDefined();
		expect(inventoryLocales.fr).toBeDefined();
		expect(inventoryLocales.it).toBeDefined();
		expect(inventoryLocales.ja).toBeDefined();
		expect(inventoryLocales.ko).toBeDefined();
		expect(inventoryLocales.pt).toBeDefined();
		expect(inventoryLocales.ru).toBeDefined();
		expect(inventoryLocales.zh).toBeDefined();
	});
});
