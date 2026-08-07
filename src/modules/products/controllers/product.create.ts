import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import {
	parseRequestData,
	getUploadedFileArray,
} from '@Helpers/multipartRequest';
import { createProduct } from '../application/createProduct';
import { CreateProductSchema } from '../schemas/product.schema';

export const productCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateProductSchema, parseRequestData(req));

	const result = await createProduct(
		validated,
		res.locals.userId as string | undefined,
		getUploadedFileArray(req, 'gallery'),
	);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PRODUCT_CREATE',
		message: 'SUCCESS_PRODUCT_CREATE',
		ns: 'products',
		data: result.data,
		warnings: result.warnings,
	});
});
