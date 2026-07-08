import { describe, it, expect } from 'vitest';
import {
	CATEGORY_PATH_LIST_PUBLIC,
	CATEGORY_PATH_LIST_ADMIN,
	CATEGORY_PATH_GET_BY_ID,
	CATEGORY_PATH_CREATE,
	CATEGORY_PATH_UPDATE,
	CATEGORY_PATH_DELETE,
	CATEGORY_PATH_PURGE,
	CATEGORY_PATH_TRASH,
	CATEGORY_PATH_RESTORE,
	CATEGORY_PATH_BULK_DELETE,
	CATEGORY_PATH_BULK_RESTORE,
	CATEGORY_PATH_BULK_PURGE,
} from '@Modules/categories/constants/paths';

describe('categories paths constants', () => {
	it('exports expected path strings', () => {
		expect(CATEGORY_PATH_LIST_PUBLIC).toBe('/categories');
		expect(CATEGORY_PATH_LIST_ADMIN).toBe('/categories/admin');
		expect(CATEGORY_PATH_GET_BY_ID).toBe('/categories/:id');
		expect(CATEGORY_PATH_CREATE).toBe('/categories');
		expect(CATEGORY_PATH_UPDATE).toBe('/categories/:id');
		expect(CATEGORY_PATH_DELETE).toBe('/categories/:id');
		expect(CATEGORY_PATH_PURGE).toBe('/categories/:id/permanent');
		expect(CATEGORY_PATH_TRASH).toBe('/categories/trash');
		expect(CATEGORY_PATH_RESTORE).toBe('/categories/:id/restore');
		expect(CATEGORY_PATH_BULK_DELETE).toBe('/categories/bulk');
		expect(CATEGORY_PATH_BULK_RESTORE).toBe('/categories/bulk/restore');
		expect(CATEGORY_PATH_BULK_PURGE).toBe('/categories/bulk/permanent');
	});
});
