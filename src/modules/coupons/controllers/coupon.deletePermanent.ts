import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteCouponPhysical } from '../application/deleteCouponPhysical';

export const couponDeletePermanentController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteCouponPhysical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COUPON_PURGED',
		message: 'SUCCESS_COUPON_PURGED',
		ns: 'coupons',
		data,
	});
});
