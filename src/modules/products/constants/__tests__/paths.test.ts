import { describe, it, expect } from 'vitest';
import {
	PRODUCT_ENTITY_TYPE,
	PRODUCT_GALLERY_MAX_ITEMS,
	PRODUCT_PATH_LIST_PUBLIC,
	PRODUCT_PATH_LIST_ADMIN,
	PRODUCT_PATH_GET_BY_ID,
	PRODUCT_PATH_GET_BY_SLUG,
	PRODUCT_PATH_CREATE,
	PRODUCT_PATH_UPDATE,
	PRODUCT_PATH_DELETE,
	PRODUCT_PATH_DELETE_PERMANENT,
	PRODUCT_PATH_TRASH,
	PRODUCT_PATH_RESTORE,
	PRODUCT_PATH_BULK_DELETE,
	PRODUCT_PATH_BULK_RESTORE,
	PRODUCT_PATH_BULK_PURGE,
} from '@Modules/products/constants/paths';

describe('products paths constants', () => {
	it('exports expected path strings', () => {
		expect(PRODUCT_ENTITY_TYPE).toBe('products');
		expect(PRODUCT_GALLERY_MAX_ITEMS).toBe(10);
		expect(PRODUCT_PATH_LIST_PUBLIC).toBe('/products');
		expect(PRODUCT_PATH_LIST_ADMIN).toBe('/products/admin');
		expect(PRODUCT_PATH_GET_BY_ID).toBe('/products/id/:id');
		expect(PRODUCT_PATH_GET_BY_SLUG).toBe('/products/:slug');
		expect(PRODUCT_PATH_CREATE).toBe('/products');
		expect(PRODUCT_PATH_UPDATE).toBe('/products/:id');
		expect(PRODUCT_PATH_DELETE).toBe('/products/:id');
		expect(PRODUCT_PATH_DELETE_PERMANENT).toBe('/products/:id/permanent');
		expect(PRODUCT_PATH_TRASH).toBe('/products/trash');
		expect(PRODUCT_PATH_RESTORE).toBe('/products/:id/restore');
		expect(PRODUCT_PATH_BULK_DELETE).toBe('/products/bulk');
		expect(PRODUCT_PATH_BULK_RESTORE).toBe('/products/bulk/restore');
		expect(PRODUCT_PATH_BULK_PURGE).toBe('/products/bulk/permanent');
	});
});
