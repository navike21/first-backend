import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getLocationById } from '../application/getLocationById';

export const locationGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getLocationById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_LOCATION_FOUND',
		message: 'SUCCESS_LOCATION_FOUND',
		ns: 'inventory',
		data,
	});
});
