import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getSiteConfig } from '../application/getSiteConfig';

// Public contract for the consuming site: the plain SiteConfigData JSON
// (header/footer/layout) inside the standard response envelope's `data`.
export const siteConfigGetPublicController = asyncHandler(async (_req, res) => {
	const config = await getSiteConfig();
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SITE_CONFIG_FOUND',
		ns: 'site-config',
		data: config,
	});
});
