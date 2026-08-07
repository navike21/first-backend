import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getProductById } from '../application/getProductById';

export const productGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getProductById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_FOUND',
		message: 'SUCCESS_PRODUCT_FOUND',
		ns: 'products',
		data,
	});
});
