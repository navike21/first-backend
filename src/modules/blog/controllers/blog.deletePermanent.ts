import { asyncHandler } from '@Middlewares/asyncHandler';
import { deleteBlogPostPhysical } from '../application/deleteBlogPostPhysical';
import { respondBlog } from './blogResponse';

export const blogDeletePermanentController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteBlogPostPhysical(id);
	respondBlog(res, 200, 'SUCCESS_BLOG_PERMANENTLY_DELETED', data);
});
