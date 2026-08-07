import { describe, it, expect } from 'vitest';
import {
	WISHLIST_PATH_GET,
	WISHLIST_PATH_ADD_ITEM,
	WISHLIST_PATH_REMOVE_ITEM,
} from '@Modules/wishlist/constants/paths';

describe('wishlist paths constants', () => {
	it('exports expected path strings', () => {
		expect(WISHLIST_PATH_GET).toBe('/wishlist');
		expect(WISHLIST_PATH_ADD_ITEM).toBe('/wishlist/items/:productId');
		expect(WISHLIST_PATH_REMOVE_ITEM).toBe('/wishlist/items/:productId');
	});
});
