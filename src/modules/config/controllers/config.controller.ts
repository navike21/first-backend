import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getConfig } from '../application/getConfig';

export const configController = asyncHandler(async (req, res) => {
	const groups = String(req.query.groups ?? '')
		.split(',')
		.map((g) => g.trim())
		.filter(Boolean);
	const lang = String(req.query.lang ?? res.locals.lang ?? 'en');

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CONFIG',
		message: 'SUCCESS_CONFIG',
		data: getConfig(groups, lang),
	});
});
