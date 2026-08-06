import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { purgeProductCategory } from '../application/purgeProductCategory';

export const productCategoryPurgeController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await purgeProductCategory(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_CATEGORY_PURGED',
		message: 'SUCCESS_PRODUCT_CATEGORY_PURGED',
		ns: 'product-categories',
		data,
	});
});
