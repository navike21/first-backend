import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getProductBySlug } from '../application/getProductBySlug';

export const productGetBySlugController = asyncHandler(async (req, res) => {
	const slug = String(req.params.slug);
	const data = await getProductBySlug(slug);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_FOUND',
		message: 'SUCCESS_PRODUCT_FOUND',
		ns: 'products',
		data,
	});
});
