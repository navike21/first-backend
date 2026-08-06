import { describe, it, expect } from 'vitest';
import {
	CUSTOMER_PATH_LIST,
	CUSTOMER_PATH_CREATE,
	CUSTOMER_PATH_GET_BY_ID,
	CUSTOMER_PATH_UPDATE,
	CUSTOMER_PATH_DELETE,
	CUSTOMER_PATH_DELETE_PERMANENT,
	CUSTOMER_PATH_TRASH,
	CUSTOMER_PATH_RESTORE,
	CUSTOMER_PATH_BULK_DELETE,
	CUSTOMER_PATH_BULK_RESTORE,
	CUSTOMER_PATH_BULK_PURGE,
} from '@Modules/customers/constants/paths';

describe('customers paths constants', () => {
	it('exports expected path strings', () => {
		expect(CUSTOMER_PATH_LIST).toBe('/customers');
		expect(CUSTOMER_PATH_CREATE).toBe('/customers');
		expect(CUSTOMER_PATH_GET_BY_ID).toBe('/customers/:id');
		expect(CUSTOMER_PATH_UPDATE).toBe('/customers/:id');
		expect(CUSTOMER_PATH_DELETE).toBe('/customers/:id');
		expect(CUSTOMER_PATH_DELETE_PERMANENT).toBe('/customers/:id/permanent');
		expect(CUSTOMER_PATH_TRASH).toBe('/customers/trash');
		expect(CUSTOMER_PATH_RESTORE).toBe('/customers/:id/restore');
		expect(CUSTOMER_PATH_BULK_DELETE).toBe('/customers/bulk');
		expect(CUSTOMER_PATH_BULK_RESTORE).toBe('/customers/bulk/restore');
		expect(CUSTOMER_PATH_BULK_PURGE).toBe('/customers/bulk/permanent');
	});
});
