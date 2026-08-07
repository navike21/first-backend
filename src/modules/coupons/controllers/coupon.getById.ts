import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getCouponById } from '../application/getCouponById';

export const couponGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getCouponById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COUPON_FOUND',
		message: 'SUCCESS_COUPON_FOUND',
		ns: 'coupons',
		data,
	});
});
