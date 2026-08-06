import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getBlogPostBySlug } from '../application/getBlogPostBySlug';

export const blogGetBySlugController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await getBlogPostBySlug(slug);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_BLOG_FOUND',
		message: 'SUCCESS_BLOG_FOUND',
		ns: 'blog',
		data,
	});
});
