import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getAppSettings } from '../application/getAppSettings';

export const appSettingsGetController = asyncHandler(async (_req, res) => {
	const settings = await getAppSettings();
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_APP_SETTINGS_FOUND',
		ns: 'app-settings',
		data: settings,
	});
});
