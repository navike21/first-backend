import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getServiceBySlug } from '../application/getServiceBySlug';

export const serviceGetBySlugController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await getServiceBySlug(slug);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_FOUND',
		message: 'SUCCESS_SERVICE_FOUND',
		ns: 'services',
		data,
	});
});
