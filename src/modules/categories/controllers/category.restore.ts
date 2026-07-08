import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreCategory } from '../application/restoreCategory';

export const categoryRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreCategory(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CATEGORY_RESTORED',
		message: 'SUCCESS_CATEGORY_RESTORED',
		ns: 'categories',
		data,
	});
});
