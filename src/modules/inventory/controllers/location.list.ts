import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listLocations } from '../application/listLocations';
import { ListLocationsQuerySchema } from '../schemas/location.schema';

export const locationListController = asyncHandler(async (req, res) => {
	const query = validate(ListLocationsQuerySchema, req.query);
	const { data, meta } = await listLocations(query);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_LOCATION_LIST',
		message: 'SUCCESS_LOCATION_LIST',
		ns: 'inventory',
		data,
		meta,
	});
});
