import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getCountries } from '../application/getCountries';

export const geoCountriesController = asyncHandler(async (_req, res) => {
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_GEO_COUNTRIES',
		message: 'SUCCESS_GEO_COUNTRIES',
		data: getCountries(),
	});
});
