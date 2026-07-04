import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedServices } from '../application/listDeletedServices';

export const serviceTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedServices({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SERVICE_TRASH_LIST',
		message: 'SUCCESS_SERVICE_TRASH_LIST',
		ns: 'services',
		data,
		meta,
	});
});
