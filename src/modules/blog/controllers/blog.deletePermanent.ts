import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteBlogPostPhysical } from '../application/deleteBlogPostPhysical';

export const blogDeletePermanentController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteBlogPostPhysical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_BLOG_PERMANENTLY_DELETED',
		message: 'SUCCESS_BLOG_PERMANENTLY_DELETED',
		ns: 'blog',
		data,
	});
});
