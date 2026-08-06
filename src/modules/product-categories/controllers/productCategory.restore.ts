import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreProductCategory } from '../application/restoreProductCategory';

export const productCategoryRestoreController = asyncHandler(
	async (req, res) => {
		const id = String(req.params.id);
		const data = await restoreProductCategory(id);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_PRODUCT_CATEGORY_RESTORED',
			message: 'SUCCESS_PRODUCT_CATEGORY_RESTORED',
			ns: 'product-categories',
			data,
		});
	},
);
