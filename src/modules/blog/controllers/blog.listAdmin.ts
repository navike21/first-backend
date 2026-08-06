import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listBlogAdmin } from '../application/listBlogAdmin';
import { ListBlogAdminQuerySchema } from '../schemas/blog.schema';

export const blogListAdminController = asyncHandler(async (req, res) => {
	const query = validate(ListBlogAdminQuerySchema, req.query);
	const { data, meta } = await listBlogAdmin({
		page: query.page,
		limit: query.limit,
		status: query.status,
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
