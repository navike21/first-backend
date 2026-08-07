import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createCoupon } from '@Modules/coupons/application/createCoupon';
import { updateCoupon } from '@Modules/coupons/application/updateCoupon';
import {
	CouponNotFoundError,
	CouponCodeConflictError,
} from '@Modules/coupons/domain/errors/CouponErrors';

withMongo();

const basePayload = {
	code: 'save10',
	type: 'percentage' as const,
	value: 10,
	isStackable: false,
	scope: { type: 'cart' as const, targetIds: [] },
	status: 'active' as const,
};

describe('updateCoupon', () => {
	it('throws CouponNotFoundError for a missing coupon', async () => {
		await expect(
			updateCoupon(crypto.randomUUID(), { status: 'inactive' }),
		).rejects.toBeInstanceOf(CouponNotFoundError);
	});

	it('updates fields on an existing coupon', async () => {
		const created = await createCoupon(basePayload);
		const updated = await updateCoupon(created.id, { value: 20 });
		expect(updated.value).toBe(20);
	});

	it('throws CouponCodeConflictError when renaming to another coupon\'s code', async () => {
		await createCoupon(basePayload);
		const second = await createCoupon({ ...basePayload, code: 'save20' });

		await expect(
			updateCoupon(second.id, { code: 'save10' }),
		).rejects.toBeInstanceOf(CouponCodeConflictError);
	});

	it('allows updating a coupon to keep its own code unchanged', async () => {
		const created = await createCoupon(basePayload);
		await expect(
			updateCoupon(created.id, { code: 'save10', status: 'inactive' }),
		).resolves.toMatchObject({ code: 'SAVE10', status: 'inactive' });
	});
});
