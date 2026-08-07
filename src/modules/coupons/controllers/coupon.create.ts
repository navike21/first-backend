import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createCoupon } from '../application/createCoupon';
import { CreateCouponSchema } from '../schemas/coupon.schema';

export const couponCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateCouponSchema, req.body);

	const data = await createCoupon(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_COUPON_CREATE',
		message: 'SUCCESS_COUPON_CREATE',
		ns: 'coupons',
		data,
	});
});
