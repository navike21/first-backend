import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getPageBySlug } from '../application/getPageBySlug';

export const pageGetBySlugPublicController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await getPageBySlug(slug, false);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAGE_FOUND',
		message: 'SUCCESS_PAGE_FOUND',
		ns: 'pages',
		data,
	});
});
