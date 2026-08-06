import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedProductCategories } from '../application/listDeletedProductCategories';

export const productCategoryTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedProductCategories({
		page,
		limit,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_CATEGORY_TRASH_LIST',
		message: 'SUCCESS_PRODUCT_CATEGORY_TRASH_LIST',
		ns: 'product-categories',
		data,
		meta,
	});
});
