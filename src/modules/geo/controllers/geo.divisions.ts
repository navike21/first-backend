import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getDivisions } from '../application/getDivisions';

export const geoDivisionsController = asyncHandler(async (req, res) => {
	const country = String(req.params.country);
	const parentCode = req.params.parentCode
		? String(req.params.parentCode)
		: undefined;

	const result = getDivisions(country, parentCode);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_GEO_DIVISIONS',
		message: 'SUCCESS_GEO_DIVISIONS',
		data: result,
	});
});
