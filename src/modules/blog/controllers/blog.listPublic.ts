import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listBlogPublic } from '../application/listBlogPublic';
import { ListBlogQuerySchema } from '../schemas/blog.schema';

export const blogListPublicController = asyncHandler(async (req, res) => {
	const query = validate(ListBlogQuerySchema, req.query);
	const { data, meta } = await listBlogPublic({
		page: query.page,
		limit: query.limit,
		categoryId: query.categoryId,
		tagId: query.tagId,
	});
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_BLOG_LIST',
		message: 'SUCCESS_BLOG_LIST',
		ns: 'blog',
		data,
		meta,
	});
});
