import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listCoupons } from '../application/listCoupons';
import { ListCouponsQuerySchema } from '../schemas/coupon.schema';

export const couponListController = asyncHandler(async (req, res) => {
	const query = validate(ListCouponsQuerySchema, req.query);
	const { data, meta } = await listCoupons(query);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COUPON_LIST',
		message: 'SUCCESS_COUPON_LIST',
		ns: 'coupons',
		data,
		meta,
	});
});
