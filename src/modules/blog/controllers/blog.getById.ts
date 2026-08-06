import { asyncHandler } from '@Middlewares/asyncHandler';
import { getBlogPostById } from '../application/getBlogPostById';
import { respondBlog } from './blogResponse';

export const blogGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getBlogPostById(id);
	respondBlog(res, 200, 'SUCCESS_BLOG_FOUND', data);
});
