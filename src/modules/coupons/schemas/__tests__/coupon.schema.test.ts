import { describe, it, expect } from 'vitest';
import {
	CreateCouponSchema,
	UpdateCouponSchema,
} from '@Modules/coupons/schemas/coupon.schema';

const categoryId = '11111111-1111-4111-8111-111111111111';

function baseInput(overrides: Record<string, unknown> = {}) {
	return {
		code: 'save10',
		type: 'percentage',
		value: 10,
		...overrides,
	};
}

describe('CreateCouponSchema', () => {
	it('accepts a minimal valid percentage coupon and uppercases the code', () => {
		const result = CreateCouponSchema.safeParse(baseInput());
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.code).toBe('SAVE10');
	});

	it('accepts a fixed coupon', () => {
		const result = CreateCouponSchema.safeParse(
			baseInput({ type: 'fixed', value: 500 }),
		);
		expect(result.success).toBe(true);
	});

	it('rejects a percentage value above 100', () => {
		const result = CreateCouponSchema.safeParse(baseInput({ value: 150 }));
		expect(result.success).toBe(false);
	});

	it('rejects maxDiscountAmount on a fixed coupon', () => {
		const result = CreateCouponSchema.safeParse(
			baseInput({
				type: 'fixed',
				value: 500,
				maxDiscountAmount: { amount: 1000, currency: 'USD' },
			}),
		);
		expect(result.success).toBe(false);
	});

	it('accepts maxDiscountAmount on a percentage coupon', () => {
		const result = CreateCouponSchema.safeParse(
			baseInput({ maxDiscountAmount: { amount: 1000, currency: 'USD' } }),
		);
		expect(result.success).toBe(true);
	});

	it('rejects a scope of products/categories with no targetIds', () => {
		const result = CreateCouponSchema.safeParse(
			baseInput({ scope: { type: 'categories', targetIds: [] } }),
		);
		expect(result.success).toBe(false);
	});

	it('accepts a categories scope with targetIds', () => {
		const result = CreateCouponSchema.safeParse(
			baseInput({ scope: { type: 'categories', targetIds: [categoryId] } }),
		);
		expect(result.success).toBe(true);
	});

	it('rejects expiresAt before startsAt', () => {
		const result = CreateCouponSchema.safeParse(
			baseInput({
				startsAt: '2026-06-01T00:00:00.000Z',
				expiresAt: '2026-01-01T00:00:00.000Z',
			}),
		);
		expect(result.success).toBe(false);
	});

	it('rejects a missing code', () => {
		const { code: _code, ...rest } = baseInput();
		const result = CreateCouponSchema.safeParse(rest);
		expect(result.success).toBe(false);
	});
});

describe('UpdateCouponSchema', () => {
	it('accepts a partial update with a single field', () => {
		const result = UpdateCouponSchema.safeParse({ status: 'inactive' });
		expect(result.success).toBe(true);
	});

	it('still enforces the percentage-value-max refinement on partial input', () => {
		const result = UpdateCouponSchema.safeParse({ type: 'percentage', value: 200 });
		expect(result.success).toBe(false);
	});
});
