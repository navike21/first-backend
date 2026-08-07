import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteCouponLogical } from '../application/deleteCouponLogical';

export const couponDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteCouponLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COUPON_DELETED',
		message: 'SUCCESS_COUPON_DELETED',
		ns: 'coupons',
		data,
	});
});
