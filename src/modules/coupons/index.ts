export { couponsApi } from './routes/route';
// Exported so `orders` (Milestone E) can validate and redeem a coupon code
// at order-creation time — the only intended external caller.
export { validateAndApplyCoupon } from './application/validateAndApplyCoupon';
export type {
	CouponCartItemInput,
	ValidateAndApplyCouponInput,
	ValidateAndApplyCouponResult,
} from './application/validateAndApplyCoupon';
