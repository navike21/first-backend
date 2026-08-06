import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getBlogPostById } from '../application/getBlogPostById';

export const blogGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getBlogPostById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_BLOG_FOUND',
		message: 'SUCCESS_BLOG_FOUND',
		ns: 'blog',
		data,
	});
});
