import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateLocation } from '../application/updateLocation';
import { UpdateLocationSchema } from '../schemas/location.schema';

export const locationUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateLocationSchema, req.body);

	const data = await updateLocation(id, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_LOCATION_UPDATE',
		message: 'SUCCESS_LOCATION_UPDATE',
		ns: 'inventory',
		data,
	});
});
