import { asyncHandler } from '@Middlewares/asyncHandler';
import { validate } from '@Helpers/validate';
import { listBlogAdmin } from '../application/listBlogAdmin';
import { ListBlogAdminQuerySchema } from '../schemas/blog.schema';
import { respondBlog } from './blogResponse';

export const blogListAdminController = asyncHandler(async (req, res) => {
	const query = validate(ListBlogAdminQuerySchema, req.query);
	const { data, meta } = await listBlogAdmin({
		page: query.page,
		limit: query.limit,
		status: query.status,
		categoryId: query.categoryId,
		tagId: query.tagId,
	});
	respondBlog(res, 200, 'SUCCESS_BLOG_LIST', data, { meta });
});
