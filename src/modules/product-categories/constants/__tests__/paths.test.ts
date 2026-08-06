import { describe, it, expect } from 'vitest';
import {
	PRODUCT_CATEGORY_PATH_LIST_PUBLIC,
	PRODUCT_CATEGORY_PATH_LIST_ADMIN,
	PRODUCT_CATEGORY_PATH_GET_BY_ID,
	PRODUCT_CATEGORY_PATH_CREATE,
	PRODUCT_CATEGORY_PATH_UPDATE,
	PRODUCT_CATEGORY_PATH_DELETE,
	PRODUCT_CATEGORY_PATH_PURGE,
	PRODUCT_CATEGORY_PATH_TRASH,
	PRODUCT_CATEGORY_PATH_RESTORE,
	PRODUCT_CATEGORY_PATH_BULK_DELETE,
	PRODUCT_CATEGORY_PATH_BULK_RESTORE,
	PRODUCT_CATEGORY_PATH_BULK_PURGE,
} from '@Modules/product-categories/constants/paths';

describe('product-categories paths constants', () => {
	it('exports expected path strings', () => {
		expect(PRODUCT_CATEGORY_PATH_LIST_PUBLIC).toBe('/product-categories');
		expect(PRODUCT_CATEGORY_PATH_LIST_ADMIN).toBe('/product-categories/admin');
		expect(PRODUCT_CATEGORY_PATH_GET_BY_ID).toBe('/product-categories/:id');
		expect(PRODUCT_CATEGORY_PATH_CREATE).toBe('/product-categories');
		expect(PRODUCT_CATEGORY_PATH_UPDATE).toBe('/product-categories/:id');
		expect(PRODUCT_CATEGORY_PATH_DELETE).toBe('/product-categories/:id');
		expect(PRODUCT_CATEGORY_PATH_PURGE).toBe(
			'/product-categories/:id/permanent',
		);
		expect(PRODUCT_CATEGORY_PATH_TRASH).toBe('/product-categories/trash');
		expect(PRODUCT_CATEGORY_PATH_RESTORE).toBe(
			'/product-categories/:id/restore',
		);
		expect(PRODUCT_CATEGORY_PATH_BULK_DELETE).toBe('/product-categories/bulk');
		expect(PRODUCT_CATEGORY_PATH_BULK_RESTORE).toBe(
			'/product-categories/bulk/restore',
		);
		expect(PRODUCT_CATEGORY_PATH_BULK_PURGE).toBe(
			'/product-categories/bulk/permanent',
		);
	});
});
