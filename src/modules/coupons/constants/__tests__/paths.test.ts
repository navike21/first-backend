import { describe, it, expect } from 'vitest';
import {
	COUPON_PATH_LIST,
	COUPON_PATH_CREATE,
	COUPON_PATH_GET_BY_ID,
	COUPON_PATH_UPDATE,
	COUPON_PATH_DELETE,
	COUPON_PATH_DELETE_PERMANENT,
	COUPON_PATH_TRASH,
	COUPON_PATH_RESTORE,
	COUPON_PATH_BULK_DELETE,
	COUPON_PATH_BULK_RESTORE,
	COUPON_PATH_BULK_PURGE,
} from '@Modules/coupons/constants/paths';

describe('coupons paths constants', () => {
	it('exports expected path strings', () => {
		expect(COUPON_PATH_LIST).toBe('/coupons');
		expect(COUPON_PATH_CREATE).toBe('/coupons');
		expect(COUPON_PATH_GET_BY_ID).toBe('/coupons/:id');
		expect(COUPON_PATH_UPDATE).toBe('/coupons/:id');
		expect(COUPON_PATH_DELETE).toBe('/coupons/:id');
		expect(COUPON_PATH_DELETE_PERMANENT).toBe('/coupons/:id/permanent');
		expect(COUPON_PATH_TRASH).toBe('/coupons/trash');
		expect(COUPON_PATH_RESTORE).toBe('/coupons/:id/restore');
		expect(COUPON_PATH_BULK_DELETE).toBe('/coupons/bulk');
		expect(COUPON_PATH_BULK_RESTORE).toBe('/coupons/bulk/restore');
		expect(COUPON_PATH_BULK_PURGE).toBe('/coupons/bulk/permanent');
	});
});
