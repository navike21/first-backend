import CouponModel from '../infrastructure/CouponModel';
import CouponRedemptionModel from '../infrastructure/CouponRedemptionModel';
import {
	CouponNotFoundError,
	CouponInactiveError,
	CouponNotYetValidError,
	CouponExpiredError,
	CouponUsageLimitReachedError,
	CouponCustomerUsageLimitReachedError,
	CouponNotApplicableError,
} from '../domain/errors/CouponErrors';
import type { Money } from '@Shared/schemas/money.schema';

export interface CouponCartItemInput {
	productId: string;
	categoryIds?: string[];
	lineTotal: Money;
}

export interface ValidateAndApplyCouponInput {
	code: string;
	customerId: string;
	cartSubtotal: Money;
	items: CouponCartItemInput[];
	/** Set once the order this redemption belongs to actually exists. */
	orderId?: string;
}

export interface ValidateAndApplyCouponResult {
	couponId: string;
	code: string;
	discountAmount: Money;
}

interface CouponScope {
	type: 'cart' | 'products' | 'categories';
	targetIds: string[];
}

function resolveApplicableAmount(
	scope: CouponScope,
	input: ValidateAndApplyCouponInput,
): Money {
	if (scope.type === 'cart') return input.cartSubtotal;

	const targetSet = new Set(scope.targetIds);
	const applicableItems = input.items.filter((item) =>
		scope.type === 'products'
			? targetSet.has(item.productId)
			: (item.categoryIds ?? []).some((categoryId) => targetSet.has(categoryId)),
	);
	const amount = applicableItems.reduce((sum, item) => sum + item.lineTotal.amount, 0);
	return { amount, currency: input.cartSubtotal.currency };
}

function calculateDiscount(
	coupon: {
		type: 'percentage' | 'fixed';
		value: number;
		maxDiscountAmount?: Money | null;
	},
	applicableAmount: Money,
): Money {
	if (coupon.type === 'fixed') {
		return {
			amount: Math.min(coupon.value, applicableAmount.amount),
			currency: applicableAmount.currency,
		};
	}
	let amount = Math.round((applicableAmount.amount * coupon.value) / 100);
	if (coupon.maxDiscountAmount) {
		amount = Math.min(amount, coupon.maxDiscountAmount.amount);
	}
	return { amount: Math.min(amount, applicableAmount.amount), currency: applicableAmount.currency };
}

/**
 * Validates a coupon code against its own rules (active, within its date
 * window, under both usage limits, applicable to something in the cart) and,
 * if valid, atomically-enough records the redemption (increments
 * `timesUsed`, inserts a `CouponRedemption` row) before returning the
 * discount amount. The only intended caller is `orders` (Milestone E) at
 * order-creation time — nothing else should be adjusting `timesUsed`.
 */
export async function validateAndApplyCoupon(
	input: ValidateAndApplyCouponInput,
): Promise<ValidateAndApplyCouponResult> {
	const coupon = await CouponModel.findOne({
		code: input.code.toUpperCase(),
		deletedAt: null,
	});
	if (!coupon) throw new CouponNotFoundError();
	if (coupon.status !== 'active') throw new CouponInactiveError();

	const now = new Date();
	if (coupon.startsAt && now < coupon.startsAt) throw new CouponNotYetValidError();
	if (coupon.expiresAt && now > coupon.expiresAt) throw new CouponExpiredError();

	if (
		coupon.usageLimitTotal != null &&
		coupon.timesUsed >= coupon.usageLimitTotal
	) {
		throw new CouponUsageLimitReachedError();
	}

	if (coupon.usageLimitPerCustomer != null) {
		const customerUsageCount = await CouponRedemptionModel.countDocuments({
			couponId: coupon.id,
			customerId: input.customerId,
		});
		if (customerUsageCount >= coupon.usageLimitPerCustomer) {
			throw new CouponCustomerUsageLimitReachedError();
		}
	}

	const applicableAmount = resolveApplicableAmount(coupon.scope, input);
	if (applicableAmount.amount <= 0) throw new CouponNotApplicableError();

	const discountAmount = calculateDiscount(coupon, applicableAmount);

	coupon.timesUsed += 1;
	await coupon.save();
	await CouponRedemptionModel.create({
		couponId: coupon.id,
		customerId: input.customerId,
		orderId: input.orderId,
		discountAmount,
	});

	return { couponId: coupon.id, code: coupon.code, discountAmount };
}
