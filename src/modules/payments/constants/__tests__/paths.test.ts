import { describe, it, expect } from 'vitest';
import {
	PAYMENT_PROVIDER_PATH_LIST,
	PAYMENT_PROVIDER_PATH_UPDATE,
	PAYMENT_METHOD_PATH_LIST,
	PAYMENT_METHOD_PATH_CREATE,
	PAYMENT_METHOD_PATH_GET_BY_ID,
	PAYMENT_METHOD_PATH_UPDATE,
	PAYMENT_METHOD_PATH_DELETE,
	PAYMENT_METHOD_PATH_DELETE_PERMANENT,
	PAYMENT_METHOD_PATH_TRASH,
	PAYMENT_METHOD_PATH_RESTORE,
	PAYMENT_METHOD_PATH_BULK_DELETE,
	PAYMENT_METHOD_PATH_BULK_RESTORE,
	PAYMENT_METHOD_PATH_BULK_PURGE,
} from '@Modules/payments/constants/paths';

describe('payments paths constants', () => {
	it('exports expected path strings', () => {
		expect(PAYMENT_PROVIDER_PATH_LIST).toBe('/payments/providers');
		expect(PAYMENT_PROVIDER_PATH_UPDATE).toBe('/payments/providers/:provider');
		expect(PAYMENT_METHOD_PATH_LIST).toBe('/payments/methods');
		expect(PAYMENT_METHOD_PATH_CREATE).toBe('/payments/methods');
		expect(PAYMENT_METHOD_PATH_GET_BY_ID).toBe('/payments/methods/:id');
		expect(PAYMENT_METHOD_PATH_UPDATE).toBe('/payments/methods/:id');
		expect(PAYMENT_METHOD_PATH_DELETE).toBe('/payments/methods/:id');
		expect(PAYMENT_METHOD_PATH_DELETE_PERMANENT).toBe('/payments/methods/:id/permanent');
		expect(PAYMENT_METHOD_PATH_TRASH).toBe('/payments/methods/trash');
		expect(PAYMENT_METHOD_PATH_RESTORE).toBe('/payments/methods/:id/restore');
		expect(PAYMENT_METHOD_PATH_BULK_DELETE).toBe('/payments/methods/bulk');
		expect(PAYMENT_METHOD_PATH_BULK_RESTORE).toBe('/payments/methods/bulk/restore');
		expect(PAYMENT_METHOD_PATH_BULK_PURGE).toBe('/payments/methods/bulk/permanent');
	});
});
