import { asyncHandler } from '@Middlewares/asyncHandler';
import { validate } from '@Helpers/validate';
import { listBlogPublic } from '../application/listBlogPublic';
import { ListBlogQuerySchema } from '../schemas/blog.schema';
import { respondBlog } from './blogResponse';

export const blogListPublicController = asyncHandler(async (req, res) => {
	const query = validate(ListBlogQuerySchema, req.query);
	const { data, meta } = await listBlogPublic({
		page: query.page,
		limit: query.limit,
		categoryId: query.categoryId,
		tagId: query.tagId,
	});
	respondBlog(res, 200, 'SUCCESS_BLOG_LIST', data, { meta });
});
