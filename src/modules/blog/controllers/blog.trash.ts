import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listDeletedBlogPosts } from '../application/listDeletedBlogPosts';
import { ListBlogTrashQuerySchema } from '../schemas/blog.schema';

export const blogTrashController = asyncHandler(async (req, res) => {
	const query = validate(ListBlogTrashQuerySchema, req.query);
	const { data, meta } = await listDeletedBlogPosts(query);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_BLOG_TRASH_LIST',
		message: 'SUCCESS_BLOG_TRASH_LIST',
		ns: 'blog',
		data,
		meta,
	});
});
