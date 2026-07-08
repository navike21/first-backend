import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteCategory } from '../application/deleteCategory';

export const categoryDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteCategory(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CATEGORY_DELETED',
		message: 'SUCCESS_CATEGORY_DELETED',
		ns: 'categories',
		data,
	});
});
