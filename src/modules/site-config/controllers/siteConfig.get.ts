import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getSiteConfig } from '../application/getSiteConfig';

export const siteConfigGetController = asyncHandler(async (_req, res) => {
	const config = await getSiteConfig();
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SITE_CONFIG_FOUND',
		ns: 'site-config',
		data: config,
	});
});
