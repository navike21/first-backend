import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteProductLogical } from '../application/deleteProductLogical';

export const productDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteProductLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_DELETED',
		message: 'SUCCESS_PRODUCT_DELETED',
		ns: 'products',
		data,
	});
});
