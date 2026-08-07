import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import CouponModel from '@Modules/coupons/infrastructure/CouponModel';
import CouponRedemptionModel from '@Modules/coupons/infrastructure/CouponRedemptionModel';
import { validateAndApplyCoupon } from '@Modules/coupons/application/validateAndApplyCoupon';
import {
	CouponNotFoundError,
	CouponInactiveError,
	CouponNotYetValidError,
	CouponExpiredError,
	CouponUsageLimitReachedError,
	CouponCustomerUsageLimitReachedError,
	CouponNotApplicableError,
} from '@Modules/coupons/domain/errors/CouponErrors';

withMongo();

const customerId = 'customer-1';
const productA = '11111111-1111-4111-8111-111111111111';
const productB = '22222222-2222-4222-8222-222222222222';
const categoryX = '33333333-3333-4333-8333-333333333333';

function cartSubtotal(amount: number) {
	return { amount, currency: 'USD' };
}

describe('validateAndApplyCoupon', () => {
	it('throws CouponNotFoundError for an unknown code', async () => {
		await expect(
			validateAndApplyCoupon({
				code: 'NOPE',
				customerId,
				cartSubtotal: cartSubtotal(1000),
				items: [],
			}),
		).rejects.toBeInstanceOf(CouponNotFoundError);
	});

	it('throws CouponInactiveError when status is inactive', async () => {
		await CouponModel.create({
			code: 'INACTIVE10',
			type: 'percentage',
			value: 10,
			status: 'inactive',
			scope: { type: 'cart', targetIds: [] },
		});

		await expect(
			validateAndApplyCoupon({
				code: 'inactive10',
				customerId,
				cartSubtotal: cartSubtotal(1000),
				items: [],
			}),
		).rejects.toBeInstanceOf(CouponInactiveError);
	});

	it('throws CouponNotYetValidError before startsAt', async () => {
		await CouponModel.create({
			code: 'FUTURE10',
			type: 'percentage',
			value: 10,
			status: 'active',
			startsAt: new Date(Date.now() + 86_400_000),
			scope: { type: 'cart', targetIds: [] },
		});

		await expect(
			validateAndApplyCoupon({
				code: 'FUTURE10',
				customerId,
				cartSubtotal: cartSubtotal(1000),
				items: [],
			}),
		).rejects.toBeInstanceOf(CouponNotYetValidError);
	});

	it('throws CouponExpiredError after expiresAt', async () => {
		await CouponModel.create({
			code: 'OLD10',
			type: 'percentage',
			value: 10,
			status: 'active',
			expiresAt: new Date(Date.now() - 86_400_000),
			scope: { type: 'cart', targetIds: [] },
		});

		await expect(
			validateAndApplyCoupon({
				code: 'OLD10',
				customerId,
				cartSubtotal: cartSubtotal(1000),
				items: [],
			}),
		).rejects.toBeInstanceOf(CouponExpiredError);
	});

	it('throws CouponUsageLimitReachedError once the total usage limit is hit', async () => {
		await CouponModel.create({
			code: 'LIMITED',
			type: 'percentage',
			value: 10,
			status: 'active',
			usageLimitTotal: 1,
			timesUsed: 1,
			scope: { type: 'cart', targetIds: [] },
		});

		await expect(
			validateAndApplyCoupon({
				code: 'LIMITED',
				customerId,
				cartSubtotal: cartSubtotal(1000),
				items: [],
			}),
		).rejects.toBeInstanceOf(CouponUsageLimitReachedError);
	});

	it('throws CouponCustomerUsageLimitReachedError once this customer has redeemed it enough times', async () => {
		const coupon = await CouponModel.create({
			code: 'ONEPERCUST',
			type: 'percentage',
			value: 10,
			status: 'active',
			usageLimitPerCustomer: 1,
			scope: { type: 'cart', targetIds: [] },
		});
		await CouponRedemptionModel.create({
			couponId: coupon.id,
			customerId,
			discountAmount: cartSubtotal(100),
		});

		await expect(
			validateAndApplyCoupon({
				code: 'ONEPERCUST',
				customerId,
				cartSubtotal: cartSubtotal(1000),
				items: [],
			}),
		).rejects.toBeInstanceOf(CouponCustomerUsageLimitReachedError);
	});

	it('throws CouponNotApplicableError when the products scope matches nothing in the cart', async () => {
		await CouponModel.create({
			code: 'PRODONLY',
			type: 'percentage',
			value: 10,
			status: 'active',
			scope: { type: 'products', targetIds: [productA] },
		});

		await expect(
			validateAndApplyCoupon({
				code: 'PRODONLY',
				customerId,
				cartSubtotal: cartSubtotal(1000),
				items: [{ productId: productB, lineTotal: cartSubtotal(1000) }],
			}),
		).rejects.toBeInstanceOf(CouponNotApplicableError);
	});

	it('applies a cart-scoped percentage discount to the full subtotal', async () => {
		await CouponModel.create({
			code: 'CART20',
			type: 'percentage',
			value: 20,
			status: 'active',
			scope: { type: 'cart', targetIds: [] },
		});

		const result = await validateAndApplyCoupon({
			code: 'CART20',
			customerId,
			cartSubtotal: cartSubtotal(10000),
			items: [],
		});

		expect(result.discountAmount).toEqual({ amount: 2000, currency: 'USD' });
	});

	it('caps a percentage discount at maxDiscountAmount', async () => {
		await CouponModel.create({
			code: 'CAPPED50',
			type: 'percentage',
			value: 50,
			status: 'active',
			maxDiscountAmount: { amount: 500, currency: 'USD' },
			scope: { type: 'cart', targetIds: [] },
		});

		const result = await validateAndApplyCoupon({
			code: 'CAPPED50',
			customerId,
			cartSubtotal: cartSubtotal(10000),
			items: [],
		});

		expect(result.discountAmount.amount).toBe(500);
	});

	it('applies a products-scoped discount only to the matching line totals', async () => {
		await CouponModel.create({
			code: 'PRODA10',
			type: 'percentage',
			value: 10,
			status: 'active',
			scope: { type: 'products', targetIds: [productA] },
		});

		const result = await validateAndApplyCoupon({
			code: 'PRODA10',
			customerId,
			cartSubtotal: cartSubtotal(3000),
			items: [
				{ productId: productA, lineTotal: cartSubtotal(2000) },
				{ productId: productB, lineTotal: cartSubtotal(1000) },
			],
		});

		// 10% of only productA's 2000 line total, not the full 3000 subtotal.
		expect(result.discountAmount.amount).toBe(200);
	});

	it('applies a categories-scoped discount based on item categoryIds', async () => {
		await CouponModel.create({
			code: 'CATX10',
			type: 'percentage',
			value: 10,
			status: 'active',
			scope: { type: 'categories', targetIds: [categoryX] },
		});

		const result = await validateAndApplyCoupon({
			code: 'CATX10',
			customerId,
			cartSubtotal: cartSubtotal(3000),
			items: [
				{ productId: productA, categoryIds: [categoryX], lineTotal: cartSubtotal(2000) },
				{ productId: productB, categoryIds: [], lineTotal: cartSubtotal(1000) },
			],
		});

		expect(result.discountAmount.amount).toBe(200);
	});

	it('caps a fixed discount at the applicable amount instead of overshooting', async () => {
		await CouponModel.create({
			code: 'FIXEDBIG',
			type: 'fixed',
			value: 100_00,
			status: 'active',
			scope: { type: 'cart', targetIds: [] },
		});

		const result = await validateAndApplyCoupon({
			code: 'FIXEDBIG',
			customerId,
			cartSubtotal: cartSubtotal(50_00),
			items: [],
		});

		expect(result.discountAmount.amount).toBe(50_00);
	});

	it('records the redemption and increments timesUsed on success', async () => {
		const coupon = await CouponModel.create({
			code: 'RECORDME',
			type: 'percentage',
			value: 10,
			status: 'active',
			scope: { type: 'cart', targetIds: [] },
		});

		await validateAndApplyCoupon({
			code: 'RECORDME',
			customerId,
			cartSubtotal: cartSubtotal(1000),
			items: [],
			orderId: 'order-1',
		});

		const updated = await CouponModel.findOne({ id: coupon.id }).lean();
		expect(updated?.timesUsed).toBe(1);

		const redemption = await CouponRedemptionModel.findOne({
			couponId: coupon.id,
			customerId,
		}).lean();
		expect(redemption).toMatchObject({ orderId: 'order-1' });
	});
});
