import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreCoupon } from '../application/restoreCoupon';

export const couponRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreCoupon(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COUPON_RESTORED',
		message: 'SUCCESS_COUPON_RESTORED',
		ns: 'coupons',
		data,
	});
});
