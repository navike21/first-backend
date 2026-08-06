import { asyncHandler } from '@Middlewares/asyncHandler';
import { validate } from '@Helpers/validate';
import { listDeletedBlogPosts } from '../application/listDeletedBlogPosts';
import { ListBlogTrashQuerySchema } from '../schemas/blog.schema';
import { respondBlog } from './blogResponse';

export const blogTrashController = asyncHandler(async (req, res) => {
	const query = validate(ListBlogTrashQuerySchema, req.query);
	const { data, meta } = await listDeletedBlogPosts(query);
	respondBlog(res, 200, 'SUCCESS_BLOG_TRASH_LIST', data, { meta });
});
