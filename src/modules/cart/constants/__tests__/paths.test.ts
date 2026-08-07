import { describe, it, expect } from 'vitest';
import {
	CART_PATH_GET,
	CART_PATH_ADD_ITEM,
	CART_PATH_UPDATE_ITEM,
	CART_PATH_REMOVE_ITEM,
	CART_PATH_CLEAR,
} from '@Modules/cart/constants/paths';

describe('cart paths constants', () => {
	it('exports expected path strings', () => {
		expect(CART_PATH_GET).toBe('/cart');
		expect(CART_PATH_ADD_ITEM).toBe('/cart/items');
		expect(CART_PATH_UPDATE_ITEM).toBe('/cart/items/:productId');
		expect(CART_PATH_REMOVE_ITEM).toBe('/cart/items/:productId');
		expect(CART_PATH_CLEAR).toBe('/cart');
	});
});
