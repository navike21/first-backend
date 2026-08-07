import { z } from 'zod';
import { MoneySchema } from '@Shared/schemas/money.schema';

const CouponScopeSchema = z.object({
	type: z.enum(['cart', 'products', 'categories'], {
		error: () => 'COUPON_SCOPE_TYPE_INVALID',
	}),
	targetIds: z
		.array(z.uuid({ message: 'COUPON_SCOPE_TARGET_ID_INVALID' }))
		.default([]),
});

const couponObject = z.object({
	code: z
		.string({
			error: (iss) =>
				iss.input === undefined ? 'COUPON_CODE_REQUIRED' : 'COUPON_CODE_INVALID',
		})
		.trim()
		.min(3, { message: 'COUPON_CODE_TOO_SHORT' })
		.max(50, { message: 'COUPON_CODE_TOO_LONG' })
		.transform((v) => v.toUpperCase()),

	type: z.enum(['percentage', 'fixed'], {
		error: () => 'COUPON_TYPE_INVALID',
	}),

	// Percentage points (1-100) when type='percentage'; integer minor-units
	// (cents) in the store's single fixed currency when type='fixed' — same
	// convention as `Money.amount`, without the redundant currency field since
	// there is only ever one store currency (see ecommerce-settings).
	value: z.coerce.number().positive({ message: 'COUPON_VALUE_INVALID' }),

	// Only meaningful for type='percentage' — caps how much an otherwise
	// unbounded percentage discount can be worth in absolute terms.
	maxDiscountAmount: MoneySchema.optional(),

	usageLimitTotal: z.coerce.number().int().positive().optional(),
	usageLimitPerCustomer: z.coerce.number().int().positive().optional(),

	startsAt: z.coerce.date().optional(),
	expiresAt: z.coerce.date().optional(),

	isStackable: z.boolean().default(false),

	scope: CouponScopeSchema.default({ type: 'cart', targetIds: [] }),

	status: z.enum(['active', 'inactive'] as const).default('active'),
});

// Cross-field checks shared by create (all fields present) and update
// (all fields optional) — each condition already tolerates an `undefined`
// field by short-circuiting true, so the same four refinements apply
// unchanged to both, mirroring products' hasVariants/variants precedent.
type CouponRefineInput = {
	type?: 'percentage' | 'fixed';
	value?: number;
	maxDiscountAmount?: { amount: number; currency: string };
	scope?: { type: 'cart' | 'products' | 'categories'; targetIds: string[] };
	startsAt?: Date;
	expiresAt?: Date;
};

const percentageValueMax = (data: CouponRefineInput) =>
	data.type !== 'percentage' || data.value === undefined || data.value <= 100;
const maxDiscountOnlyForPercentage = (data: CouponRefineInput) =>
	data.type === 'percentage' || data.maxDiscountAmount === undefined;
const scopeTargetsRequired = (data: CouponRefineInput) =>
	!data.scope || data.scope.type === 'cart' || data.scope.targetIds.length > 0;
const dateRangeValid = (data: CouponRefineInput) =>
	!data.startsAt || !data.expiresAt || data.startsAt <= data.expiresAt;

export const CreateCouponSchema = couponObject
	.refine(percentageValueMax, { message: 'COUPON_PERCENTAGE_VALUE_MAX', path: ['value'] })
	.refine(maxDiscountOnlyForPercentage, {
		message: 'COUPON_MAX_DISCOUNT_ONLY_FOR_PERCENTAGE',
		path: ['maxDiscountAmount'],
	})
	.refine(scopeTargetsRequired, {
		message: 'COUPON_SCOPE_TARGETS_REQUIRED',
		path: ['scope', 'targetIds'],
	})
	.refine(dateRangeValid, { message: 'COUPON_DATE_RANGE_INVALID', path: ['expiresAt'] });

export const UpdateCouponSchema = couponObject
	.partial()
	.refine(percentageValueMax, { message: 'COUPON_PERCENTAGE_VALUE_MAX', path: ['value'] })
	.refine(maxDiscountOnlyForPercentage, {
		message: 'COUPON_MAX_DISCOUNT_ONLY_FOR_PERCENTAGE',
		path: ['maxDiscountAmount'],
	})
	.refine(scopeTargetsRequired, {
		message: 'COUPON_SCOPE_TARGETS_REQUIRED',
		path: ['scope', 'targetIds'],
	})
	.refine(dateRangeValid, { message: 'COUPON_DATE_RANGE_INVALID', path: ['expiresAt'] });

export const ListCouponsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	status: z.string().optional(),
	search: z.string().trim().max(200).optional(),
});

export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
export type UpdateCouponInput = z.infer<typeof UpdateCouponSchema>;
export type ListCouponsQuery = z.infer<typeof ListCouponsQuerySchema>;
