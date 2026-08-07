import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { moneyType } from '@Shared/infrastructure/moneyType';

// One row per successful redemption — a separate collection (not an array
// embedded in Coupon) so `usageLimitPerCustomer` can be enforced with a
// simple count query, and so a future admin screen can list who used what
// without loading every coupon document. Written only by
// `validateAndApplyCoupon` (`orders` is the only real caller, from
// Milestone E onward).
const CouponRedemptionSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		couponId: { type: String, required: true },
		customerId: { type: String, required: true },
		orderId: { type: String },
		discountAmount: { type: moneyType, required: true },
	},
	{ timestamps: true },
);

CouponRedemptionSchema.index({ couponId: 1, customerId: 1 });

const CouponRedemptionModel = model('CouponRedemption', CouponRedemptionSchema);
export default CouponRedemptionModel;
