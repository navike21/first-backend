import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { adjustStock } from '../application/adjustStock';
import { AdjustStockSchema } from '../schemas/stock.schema';

export const stockAdjustController = asyncHandler(async (req, res) => {
	const validated = validate(AdjustStockSchema, req.body);

	const data = await adjustStock(validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STOCK_ADJUSTED',
		message: 'SUCCESS_STOCK_ADJUSTED',
		ns: 'inventory',
		data,
	});
});
