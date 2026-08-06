import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedLocations } from '../application/listDeletedLocations';

export const locationTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedLocations({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_LOCATION_TRASH_LIST',
		message: 'SUCCESS_LOCATION_TRASH_LIST',
		ns: 'inventory',
		data,
		meta,
	});
});
