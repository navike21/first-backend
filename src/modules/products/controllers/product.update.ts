import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import {
	parseRequestData,
	getUploadedFileArray,
} from '@Helpers/multipartRequest';
import { updateProduct } from '../application/updateProduct';
import { UpdateProductSchema } from '../schemas/product.schema';

export const productUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateProductSchema, parseRequestData(req));

	const result = await updateProduct(
		id,
		validated,
		res.locals.userId as string | undefined,
		getUploadedFileArray(req, 'gallery'),
	);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_UPDATE',
		message: 'SUCCESS_PRODUCT_UPDATE',
		ns: 'products',
		data: result.data,
		warnings: result.warnings,
	});
});
