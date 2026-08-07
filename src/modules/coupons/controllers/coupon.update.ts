import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateCoupon } from '../application/updateCoupon';
import { UpdateCouponSchema } from '../schemas/coupon.schema';

export const couponUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateCouponSchema, req.body);

	const data = await updateCoupon(id, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COUPON_UPDATE',
		message: 'SUCCESS_COUPON_UPDATE',
		ns: 'coupons',
		data,
	});
});
