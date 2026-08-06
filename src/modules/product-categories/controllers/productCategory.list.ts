import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listProductCategories } from '../application/listProductCategories';
import { ListProductCategoriesQuerySchema } from '../schemas/productCategory.schema';

export const productCategoryListPublicController = asyncHandler(
	async (req, res) => {
		const query = ListProductCategoriesQuerySchema.parse(req.query);
		const { data, meta } = await listProductCategories({
			page: query.page,
			limit: query.limit,
			adminView: false,
			parentId: query.parentId,
		});
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_PRODUCT_CATEGORY_LIST',
			message: 'SUCCESS_PRODUCT_CATEGORY_LIST',
			ns: 'product-categories',
			data,
			meta,
		});
	},
);

export const productCategoryListAdminController = asyncHandler(
	async (req, res) => {
		const query = ListProductCategoriesQuerySchema.parse(req.query);
		const { data, meta } = await listProductCategories({
			page: query.page,
			limit: query.limit,
			adminView: true,
			search: query.search,
			isActive: query.isActive,
			parentId: query.parentId,
		});
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_PRODUCT_CATEGORY_LIST',
			message: 'SUCCESS_PRODUCT_CATEGORY_LIST',
			ns: 'product-categories',
			data,
			meta,
		});
	},
);
