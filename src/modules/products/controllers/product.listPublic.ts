import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listProductsPublic } from '../application/listProductsPublic';
import { ListProductsQuerySchema } from '../schemas/product.schema';

export const productListPublicController = asyncHandler(async (req, res) => {
	const query = ListProductsQuerySchema.parse(req.query);
	const { data, meta } = await listProductsPublic({
		page: query.page,
		limit: query.limit,
		search: query.search,
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
