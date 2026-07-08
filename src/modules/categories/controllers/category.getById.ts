import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getCategoryById } from '../application/getCategoryById';

export const categoryGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getCategoryById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CATEGORY_FOUND',
		message: 'SUCCESS_CATEGORY_FOUND',
		ns: 'categories',
		data,
	});
});
