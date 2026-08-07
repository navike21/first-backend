import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { moneyType } from '@Shared/infrastructure/moneyType';

const CouponScopeSchema = new Schema(
	{
		type: {
			type: String,
			enum: ['cart', 'products', 'categories'],
			required: true,
		},
		targetIds: { type: [String], default: [] },
	},
	{ _id: false },
);

const CouponSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		code: { type: String, required: true, uppercase: true, trim: true },
		type: { type: String, enum: ['percentage', 'fixed'], required: true },
		value: { type: Number, required: true },
		maxDiscountAmount: { type: moneyType },
		usageLimitTotal: { type: Number },
		usageLimitPerCustomer: { type: Number },
		timesUsed: { type: Number, required: true, default: 0 },
		startsAt: { type: Date },
		expiresAt: { type: Date },
		isStackable: { type: Boolean, default: false },
		scope: {
			type: CouponScopeSchema,
			required: true,
			default: () => ({ type: 'cart', targetIds: [] }),
		},
		status: {
			type: String,
			required: true,
			default: 'active',
			enum: ['active', 'inactive'],
		},
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

CouponSchema.index({ status: 1, createdAt: -1 });

// A coupon code is unique per non-deleted record — same partial-index
// precedent as every other unique-ish field in this codebase (a trashed
// coupon frees its code for reuse).
CouponSchema.index(
	{ code: 1 },
	{ unique: true, partialFilterExpression: { deletedAt: null } },
);

const CouponModel = model('Coupon', CouponSchema);
export default CouponModel;
