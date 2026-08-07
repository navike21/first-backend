import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedCoupons } from '../application/listDeletedCoupons';

export const couponTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedCoupons({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_COUPON_TRASH_LIST',
		message: 'SUCCESS_COUPON_TRASH_LIST',
		ns: 'coupons',
		data,
		meta,
	});
});
