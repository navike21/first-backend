import { describe, it, expect } from 'vitest';
import {
	SHIPPING_RULE_PATH_LIST,
	SHIPPING_RULE_PATH_CREATE,
	SHIPPING_RULE_PATH_GET_BY_ID,
	SHIPPING_RULE_PATH_UPDATE,
	SHIPPING_RULE_PATH_DELETE,
	SHIPPING_RULE_PATH_DELETE_PERMANENT,
	SHIPPING_RULE_PATH_TRASH,
	SHIPPING_RULE_PATH_RESTORE,
	SHIPPING_RULE_PATH_BULK_DELETE,
	SHIPPING_RULE_PATH_BULK_RESTORE,
	SHIPPING_RULE_PATH_BULK_PURGE,
} from '@Modules/shipping/constants/paths';

describe('shipping paths constants', () => {
	it('exports expected path strings', () => {
		expect(SHIPPING_RULE_PATH_LIST).toBe('/shipping/rules');
		expect(SHIPPING_RULE_PATH_CREATE).toBe('/shipping/rules');
		expect(SHIPPING_RULE_PATH_GET_BY_ID).toBe('/shipping/rules/:id');
		expect(SHIPPING_RULE_PATH_UPDATE).toBe('/shipping/rules/:id');
		expect(SHIPPING_RULE_PATH_DELETE).toBe('/shipping/rules/:id');
		expect(SHIPPING_RULE_PATH_DELETE_PERMANENT).toBe('/shipping/rules/:id/permanent');
		expect(SHIPPING_RULE_PATH_TRASH).toBe('/shipping/rules/trash');
		expect(SHIPPING_RULE_PATH_RESTORE).toBe('/shipping/rules/:id/restore');
		expect(SHIPPING_RULE_PATH_BULK_DELETE).toBe('/shipping/rules/bulk');
		expect(SHIPPING_RULE_PATH_BULK_RESTORE).toBe('/shipping/rules/bulk/restore');
		expect(SHIPPING_RULE_PATH_BULK_PURGE).toBe('/shipping/rules/bulk/permanent');
	});
});
