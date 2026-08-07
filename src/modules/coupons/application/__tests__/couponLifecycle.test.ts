import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createCoupon } from '@Modules/coupons/application/createCoupon';
import { getCouponById } from '@Modules/coupons/application/getCouponById';
import { listCoupons } from '@Modules/coupons/application/listCoupons';
import { listDeletedCoupons } from '@Modules/coupons/application/listDeletedCoupons';
import { deleteCouponLogical } from '@Modules/coupons/application/deleteCouponLogical';
import { deleteCouponPhysical } from '@Modules/coupons/application/deleteCouponPhysical';
import { restoreCoupon } from '@Modules/coupons/application/restoreCoupon';
import { deleteCouponsBulk } from '@Modules/coupons/application/deleteCouponsBulk';
import { restoreCouponsBulk } from '@Modules/coupons/application/restoreCouponsBulk';
import { purgeCouponsBulk } from '@Modules/coupons/application/purgeCouponsBulk';
import { CouponNotFoundError } from '@Modules/coupons/domain/errors/CouponErrors';

withMongo();

function payload(code: string) {
	return {
		code,
		type: 'percentage' as const,
		value: 10,
		isStackable: false,
		scope: { type: 'cart' as const, targetIds: [] },
		status: 'active' as const,
	};
}

describe('coupon lifecycle', () => {
	it('getCouponById returns the coupon, and 404s once soft-deleted', async () => {
		const created = await createCoupon(payload('LIFECYCLE1'));
		await expect(getCouponById(created.id)).resolves.toMatchObject({
			id: created.id,
		});

		await deleteCouponLogical(created.id);
		await expect(getCouponById(created.id)).rejects.toBeInstanceOf(
			CouponNotFoundError,
		);
	});

	it('listCoupons filters by status and search', async () => {
		await createCoupon(payload('WINTER10'));
		await createCoupon({ ...payload('SUMMER10'), status: 'inactive' });

		const active = await listCoupons({ page: 1, limit: 10, status: 'active' });
		expect(active.data.map((c) => c.code)).toContain('WINTER10');
		expect(active.data.map((c) => c.code)).not.toContain('SUMMER10');

		const searched = await listCoupons({ page: 1, limit: 10, search: 'winter' });
		expect(searched.data).toHaveLength(1);
	});

	it('soft-delete then restore round-trips through the trash listing', async () => {
		const created = await createCoupon(payload('TRASHME'));
		await deleteCouponLogical(created.id);

		const trash = await listDeletedCoupons({ page: 1, limit: 10 });
		expect(trash.data.map((c) => c.id)).toContain(created.id);

		await restoreCoupon(created.id);
		const active = await listCoupons({ page: 1, limit: 10 });
		expect(active.data.map((c) => c.id)).toContain(created.id);
	});

	it('deleteCouponPhysical removes a trashed coupon permanently', async () => {
		const created = await createCoupon(payload('PURGEME'));
		await deleteCouponLogical(created.id);

		await deleteCouponPhysical(created.id);
		await expect(getCouponById(created.id)).rejects.toBeInstanceOf(
			CouponNotFoundError,
		);
	});

	it('bulk soft-delete, restore, and purge report processed/notFound ids', async () => {
		const a = await createCoupon(payload('BULK-A'));
		const b = await createCoupon(payload('BULK-B'));
		const missingId = crypto.randomUUID();

		const expectedIds = new Set([a.id, b.id]);

		const deleted = await deleteCouponsBulk([a.id, b.id, missingId]);
		expect(new Set(deleted.processedIds)).toEqual(expectedIds);
		expect(deleted.notFoundIds).toEqual([missingId]);

		const restored = await restoreCouponsBulk([a.id, b.id]);
		expect(new Set(restored.processedIds)).toEqual(expectedIds);

		await deleteCouponsBulk([a.id, b.id]);
		const purged = await purgeCouponsBulk([a.id, b.id]);
		expect(new Set(purged.processedIds)).toEqual(expectedIds);

		await expect(getCouponById(a.id)).rejects.toBeInstanceOf(CouponNotFoundError);
	});
});
