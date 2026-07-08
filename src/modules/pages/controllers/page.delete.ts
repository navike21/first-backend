import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deletePage } from '../application/deletePage';

export const pageDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deletePage(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_DELETED',
		message: 'SUCCESS_PAGE_DELETED',
		ns: 'pages',
		data,
	});
});
