import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteProductPhysical } from '../application/deleteProductPhysical';

export const productDeletePermanentController = asyncHandler(
	async (req, res) => {
		const id = String(req.params.id);
		const data = await deleteProductPhysical(id);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_PRODUCT_PERMANENTLY_DELETED',
			message: 'SUCCESS_PRODUCT_PERMANENTLY_DELETED',
			ns: 'products',
			data,
		});
	},
);
