import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { purgeCategory } from '../application/purgeCategory';

export const categoryPurgeController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await purgeCategory(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CATEGORY_PURGED',
		message: 'SUCCESS_CATEGORY_PURGED',
		ns: 'categories',
		data,
	});
});
