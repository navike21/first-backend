import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFileField } from '@Helpers/multipartRequest';
import { updateAppSettings } from '../application/updateAppSettings';
import { AppSettingsUpdateSchema } from '../schemas/appSettings.schema';

export const appSettingsUpdateController = asyncHandler(async (req, res) => {
	const raw = (parseRequestData(req) as Record<string, unknown>) ?? {};
	const files = {
		logo: getUploadedFileField(req, 'logo'),
		favicon: getUploadedFileField(req, 'favicon'),
	};

	// A file-only update (no settings fields) still targets the appearance
	// category, so inject it to satisfy the "at least one category" rule.
	const hasFile = Boolean(files.logo || files.favicon);
	const toValidate =
		hasFile &&
		raw.general === undefined &&
		raw.notifications === undefined &&
		raw.appearance === undefined
			? { ...raw, appearance: {} }
			: raw;

	const validated = validate(AppSettingsUpdateSchema, toValidate);

	const result = await updateAppSettings(
		validated,
		files,
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_APP_SETTINGS_UPDATED',
		ns: 'app-settings',
		data: result.data,
		warnings: result.warnings,
	});
});
