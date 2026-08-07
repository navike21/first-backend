import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedProducts } from '../application/listDeletedProducts';

export const productTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedProducts({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PRODUCT_TRASH_LIST',
		message: 'SUCCESS_PRODUCT_TRASH_LIST',
		ns: 'products',
		data,
		meta,
	});
});
