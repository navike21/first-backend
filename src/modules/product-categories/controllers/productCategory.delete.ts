import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteProductCategory } from '../application/deleteProductCategory';

export const productCategoryDeleteController = asyncHandler(
	async (req, res) => {
		const id = String(req.params.id);
		const data = await deleteProductCategory(id);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_PRODUCT_CATEGORY_DELETED',
			message: 'SUCCESS_PRODUCT_CATEGORY_DELETED',
			ns: 'product-categories',
			data,
		});
	},
);
