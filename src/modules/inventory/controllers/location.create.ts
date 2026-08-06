import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createLocation } from '../application/createLocation';
import { CreateLocationSchema } from '../schemas/location.schema';

export const locationCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateLocationSchema, req.body);

	const data = await createLocation(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_LOCATION_CREATE',
		message: 'SUCCESS_LOCATION_CREATE',
		ns: 'inventory',
		data,
	});
});
