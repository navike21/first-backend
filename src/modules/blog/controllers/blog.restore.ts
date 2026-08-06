import { asyncHandler } from '@Middlewares/asyncHandler';
import { restoreBlogPost } from '../application/restoreBlogPost';
import { respondBlog } from './blogResponse';

export const blogRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreBlogPost(id);
	respondBlog(res, 200, 'SUCCESS_BLOG_RESTORED', data);
});
