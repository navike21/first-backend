import { asyncHandler } from '@Middlewares/asyncHandler';
import { getBlogPostBySlug } from '../application/getBlogPostBySlug';
import { respondBlog } from './blogResponse';

export const blogGetBySlugController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await getBlogPostBySlug(slug);
	respondBlog(res, 200, 'SUCCESS_BLOG_FOUND', data);
});
