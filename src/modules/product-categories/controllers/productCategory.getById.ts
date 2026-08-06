import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getProductCategoryById } from '../application/getProductCategoryById';

export const productCategoryGetByIdController = asyncHandler(
	async (req, res) => {
		const id = String(req.params.id);
		const data = await getProductCategoryById(id);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_PRODUCT_CATEGORY_FOUND',
			message: 'SUCCESS_PRODUCT_CATEGORY_FOUND',
			ns: 'product-categories',
			data,
		});
	},
);
