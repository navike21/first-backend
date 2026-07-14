import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getCountries } from '../application/getCountries';

export const geoCountriesController = asyncHandler(async (req, res) => {
	const lang =
		(req.query.lang as string | undefined) ?? res.locals.lang ?? 'en';
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_GEO_COUNTRIES',
		message: 'SUCCESS_GEO_COUNTRIES',
		data: getCountries(lang),
	});
});
