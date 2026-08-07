import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreProduct } from '../application/restoreProduct';

export const productRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreProduct(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_RESTORED',
		message: 'SUCCESS_PRODUCT_RESTORED',
		ns: 'products',
		data,
	});
});
