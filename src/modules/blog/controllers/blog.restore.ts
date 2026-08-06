import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreBlogPost } from '../application/restoreBlogPost';

export const blogRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreBlogPost(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_BLOG_RESTORED',
		message: 'SUCCESS_BLOG_RESTORED',
		ns: 'blog',
		data,
	});
});
