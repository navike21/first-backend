import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deletePage } from '../application/deletePage';

export const pageDeleteController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await deletePage(slug);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_DELETED',
		message: 'SUCCESS_PAGE_DELETED',
		ns: 'pages',
		data,
	});
});
