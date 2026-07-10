import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateSiteConfig } from '../application/updateSiteConfig';
import { SiteConfigUpdateSchema } from '../schemas/siteConfig.schema';

export const siteConfigUpdateController = asyncHandler(async (req, res) => {
	const validated = validate(SiteConfigUpdateSchema, req.body);

	const data = await updateSiteConfig(validated);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SITE_CONFIG_UPDATED',
		ns: 'site-config',
		data,
	});
});
