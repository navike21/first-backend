import { asyncHandler } from '@Middlewares/asyncHandler';
import { deleteBlogPostLogical } from '../application/deleteBlogPostLogical';
import { respondBlog } from './blogResponse';

export const blogDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteBlogPostLogical(id);
	respondBlog(res, 200, 'SUCCESS_BLOG_DELETED', data);
});
