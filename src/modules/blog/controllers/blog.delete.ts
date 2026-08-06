import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteBlogPostLogical } from '../application/deleteBlogPostLogical';

export const blogDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteBlogPostLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_BLOG_DELETED',
		message: 'SUCCESS_BLOG_DELETED',
		ns: 'blog',
		data,
	});
});
