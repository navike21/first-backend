import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getStockByProduct } from '../application/getStockByProduct';

export const stockGetByProductController = asyncHandler(async (req, res) => {
	const productId = String(req.params.productId);
	const data = await getStockByProduct(productId);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STOCK_FOUND',
		message: 'SUCCESS_STOCK_FOUND',
		ns: 'inventory',
		data,
	});
});
