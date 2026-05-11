import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { updateAppSettings } from '../application/updateAppSettings';
import { AppSettingsUpdateSchema } from '../schemas/appSettings.schema';

export const appSettingsUpdateController = asyncHandler(async (req, res) => {
	const parsed = AppSettingsUpdateSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 400,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed for the provided data',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}
	const settings = await updateAppSettings(parsed.data!);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_APP_SETTINGS_UPDATED',
		ns: 'app-settings',
		data: settings,
	});
});
