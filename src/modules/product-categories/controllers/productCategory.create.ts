import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createProductCategory } from '../application/createProductCategory';
import { CreateProductCategorySchema } from '../schemas/productCategory.schema';

export const productCategoryCreateController = asyncHandler(
	async (req, res) => {
		const validated = validate(CreateProductCategorySchema, req.body);

		const data = await createProductCategory(validated);
		successResponse(res, {
			statusCode: 201,
			code: 'SUCCESS_PRODUCT_CATEGORY_CREATE',
			message: 'SUCCESS_PRODUCT_CATEGORY_CREATE',
			ns: 'product-categories',
			data,
		});
	},
);
