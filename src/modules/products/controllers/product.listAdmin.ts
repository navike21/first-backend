import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listProductsAdmin } from '../application/listProductsAdmin';
import { ListProductsAdminQuerySchema } from '../schemas/product.schema';

export const productListAdminController = asyncHandler(async (req, res) => {
	const query = ListProductsAdminQuerySchema.parse(req.query);
	const { data, meta } = await listProductsAdmin({
		page: query.page,
		limit: query.limit,
		search: query.search,
		status: query.status,
		categoryId: query.categoryId,
		tagId: query.tagId,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_LIST',
		message: 'SUCCESS_PRODUCT_LIST',
		ns: 'products',
		data,
		meta,
	});
});
