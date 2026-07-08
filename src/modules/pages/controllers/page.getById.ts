import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getPageById } from '../application/getPageById';

export const pageGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getPageById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_FOUND',
		message: 'SUCCESS_PAGE_FOUND',
		ns: 'pages',
		data,
	});
});
