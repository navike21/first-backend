import { describe, it, expect } from 'vitest';
import {
	LOCATION_PATH_LIST,
	LOCATION_PATH_CREATE,
	LOCATION_PATH_GET_BY_ID,
	LOCATION_PATH_UPDATE,
	LOCATION_PATH_DELETE,
	LOCATION_PATH_DELETE_PERMANENT,
	LOCATION_PATH_TRASH,
	LOCATION_PATH_RESTORE,
	LOCATION_PATH_BULK_DELETE,
	LOCATION_PATH_BULK_RESTORE,
	LOCATION_PATH_BULK_PURGE,
	STOCK_PATH_ADJUST,
	STOCK_PATH_GET_BY_PRODUCT,
} from '@Modules/inventory/constants/paths';

describe('inventory paths constants', () => {
	it('exports expected path strings', () => {
		expect(LOCATION_PATH_LIST).toBe('/inventory/locations');
		expect(LOCATION_PATH_CREATE).toBe('/inventory/locations');
		expect(LOCATION_PATH_GET_BY_ID).toBe('/inventory/locations/:id');
		expect(LOCATION_PATH_UPDATE).toBe('/inventory/locations/:id');
		expect(LOCATION_PATH_DELETE).toBe('/inventory/locations/:id');
		expect(LOCATION_PATH_DELETE_PERMANENT).toBe(
			'/inventory/locations/:id/permanent',
		);
		expect(LOCATION_PATH_TRASH).toBe('/inventory/locations/trash');
		expect(LOCATION_PATH_RESTORE).toBe('/inventory/locations/:id/restore');
		expect(LOCATION_PATH_BULK_DELETE).toBe('/inventory/locations/bulk');
		expect(LOCATION_PATH_BULK_RESTORE).toBe(
			'/inventory/locations/bulk/restore',
		);
		expect(LOCATION_PATH_BULK_PURGE).toBe(
			'/inventory/locations/bulk/permanent',
		);
		expect(STOCK_PATH_ADJUST).toBe('/inventory/stock');
		expect(STOCK_PATH_GET_BY_PRODUCT).toBe('/inventory/stock/:productId');
	});
});
