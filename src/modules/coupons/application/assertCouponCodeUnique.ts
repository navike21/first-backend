import CouponModel from '../infrastructure/CouponModel';
import { CouponCodeConflictError } from '../domain/errors/CouponErrors';

/**
 * Pre-check for the coupon code uniqueness key. UX-only: the partial unique
 * index on `code` (scoped to `deletedAt: null`) is the real source of
 * truth — same precedent as `assertCustomerEmailUnique`.
 */
export async function assertCouponCodeUnique(
	code: string,
	excludeId?: string,
): Promise<void> {
	const query: Record<string, unknown> = {
		code: code.toUpperCase(),
		deletedAt: null,
	};
	if (excludeId) query.id = { $ne: excludeId };

	const existing = await CouponModel.findOne(query).lean();
	if (existing) throw new CouponCodeConflictError();
}
