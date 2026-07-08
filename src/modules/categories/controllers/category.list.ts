import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listCategories } from '../application/listCategories';
import { ListCategoriesQuerySchema } from '../schemas/category.schema';

export const categoryListPublicController = asyncHandler(async (req, res) => {
	const query = ListCategoriesQuerySchema.parse(req.query);
	const { data, meta } = await listCategories({
		page: query.page,
		limit: query.limit,
		adminView: false,
		parentId: query.parentId,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CATEGORY_LIST',
		message: 'SUCCESS_CATEGORY_LIST',
		ns: 'categories',
		data,
		meta,
	});
});

export const categoryListAdminController = asyncHandler(async (req, res) => {
	const query = ListCategoriesQuerySchema.parse(req.query);
	const { data, meta } = await listCategories({
		page: query.page,
		limit: query.limit,
		adminView: true,
		search: query.search,
		isActive: query.isActive,
		parentId: query.parentId,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CATEGORY_LIST',
		message: 'SUCCESS_CATEGORY_LIST',
		ns: 'categories',
		data,
		meta,
	});
});
