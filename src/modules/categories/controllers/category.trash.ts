import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedCategories } from '../application/listDeletedCategories';

export const categoryTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedCategories({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CATEGORY_TRASH_LIST',
		message: 'SUCCESS_CATEGORY_TRASH_LIST',
		ns: 'categories',
		data,
		meta,
	});
});
