import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createCoupon } from '@Modules/coupons/application/createCoupon';
import { CouponCodeConflictError } from '@Modules/coupons/domain/errors/CouponErrors';

withMongo();

const basePayload = {
	code: 'save10',
	type: 'percentage' as const,
	value: 10,
	isStackable: false,
	scope: { type: 'cart' as const, targetIds: [] },
	status: 'active' as const,
};

describe('createCoupon', () => {
	it('creates a coupon and uppercases the code', async () => {
		const result = await createCoupon(basePayload);
		expect(result.code).toBe('SAVE10');
		expect(result.timesUsed).toBe(0);
	});

	it('throws CouponCodeConflictError for a duplicate code', async () => {
		await createCoupon(basePayload);
		await expect(createCoupon(basePayload)).rejects.toBeInstanceOf(
			CouponCodeConflictError,
		);
	});

	it('allows reusing a code from a soft-deleted coupon', async () => {
		const first = await createCoupon(basePayload);
		const CouponModel = (await import('@Modules/coupons/infrastructure/CouponModel'))
			.default;
		await CouponModel.updateOne({ id: first.id }, { deletedAt: new Date() });

		await expect(createCoupon(basePayload)).resolves.toMatchObject({
			code: 'SAVE10',
		});
	});
});
