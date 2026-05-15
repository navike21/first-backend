import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { updateAppSettings } from '../application/updateAppSettings';
import { AppSettingsUpdateSchema } from '../schemas/appSettings.schema';

export const appSettingsUpdateController = asyncHandler(async (req, res) => {
	const parsed = AppSettingsUpdateSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.badRequest('VALIDATION_SCHEMA_ERROR', 'Validation failed for the provided data', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}
	const settings = await updateAppSettings(parsed.data);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_APP_SETTINGS_UPDATED',
		ns: 'app-settings',
		data: settings,
	});
});
