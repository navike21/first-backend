import { describe, it, expect } from 'vitest';
import { wishlistLocales } from '@Modules/wishlist/locales/index';

describe('wishlistLocales', () => {
	it('exports an object with all locale keys', () => {
		expect(wishlistLocales).toBeDefined();
		expect(wishlistLocales.en).toBeDefined();
		expect(wishlistLocales.es).toBeDefined();
		expect(wishlistLocales.de).toBeDefined();
		expect(wishlistLocales.fr).toBeDefined();
		expect(wishlistLocales.it).toBeDefined();
		expect(wishlistLocales.ja).toBeDefined();
		expect(wishlistLocales.ko).toBeDefined();
		expect(wishlistLocales.pt).toBeDefined();
		expect(wishlistLocales.ru).toBeDefined();
		expect(wishlistLocales.zh).toBeDefined();
	});
});
