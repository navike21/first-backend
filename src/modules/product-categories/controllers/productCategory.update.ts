import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateProductCategory } from '../application/updateProductCategory';
import { UpdateProductCategorySchema } from '../schemas/productCategory.schema';

export const productCategoryUpdateController = asyncHandler(
	async (req, res) => {
		const id = String(req.params.id);
		const validated = validate(UpdateProductCategorySchema, req.body);

		const data = await updateProductCategory(id, validated);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_PRODUCT_CATEGORY_UPDATE',
			message: 'SUCCESS_PRODUCT_CATEGORY_UPDATE',
			ns: 'product-categories',
			data,
		});
	},
);
