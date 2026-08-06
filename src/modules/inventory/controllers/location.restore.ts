import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreLocation } from '../application/restoreLocation';

export const locationRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreLocation(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_LOCATION_RESTORED',
		message: 'SUCCESS_LOCATION_RESTORED',
		ns: 'inventory',
		data,
	});
});
