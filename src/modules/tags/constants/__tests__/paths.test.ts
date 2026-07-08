import { describe, it, expect } from 'vitest';
import {
	TAG_PATH_LIST_PUBLIC,
	TAG_PATH_LIST_ADMIN,
	TAG_PATH_GET_BY_ID,
	TAG_PATH_CREATE,
	TAG_PATH_UPDATE,
	TAG_PATH_DELETE,
	TAG_PATH_PURGE,
	TAG_PATH_TRASH,
	TAG_PATH_RESTORE,
	TAG_PATH_BULK_DELETE,
	TAG_PATH_BULK_RESTORE,
	TAG_PATH_BULK_PURGE,
} from '@Modules/tags/constants/paths';

describe('tags paths constants', () => {
	it('exports expected path strings', () => {
		expect(TAG_PATH_LIST_PUBLIC).toBe('/tags');
		expect(TAG_PATH_LIST_ADMIN).toBe('/tags/admin');
		expect(TAG_PATH_GET_BY_ID).toBe('/tags/:id');
		expect(TAG_PATH_CREATE).toBe('/tags');
		expect(TAG_PATH_UPDATE).toBe('/tags/:id');
		expect(TAG_PATH_DELETE).toBe('/tags/:id');
		expect(TAG_PATH_PURGE).toBe('/tags/:id/permanent');
		expect(TAG_PATH_TRASH).toBe('/tags/trash');
		expect(TAG_PATH_RESTORE).toBe('/tags/:id/restore');
		expect(TAG_PATH_BULK_DELETE).toBe('/tags/bulk');
		expect(TAG_PATH_BULK_RESTORE).toBe('/tags/bulk/restore');
		expect(TAG_PATH_BULK_PURGE).toBe('/tags/bulk/permanent');
	});
});
