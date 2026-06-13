import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { parseRequestData, getUploadedFile } from '@Helpers/multipartRequest';
import {
	UpdateMyProfileSchema,
	UpdatePreferencesSchema,
} from '../schemas/user.schema';
import { getMyProfile } from '../application/getMyProfile';
import { updateMyProfile } from '../application/updateMyProfile';
import { updateMyPreferences } from '../application/updateMyPreferences';

export const getMyProfileController = asyncHandler(async (_req, res) => {
	const userId = res.locals.userId as string;
	const user = await getMyProfile(userId);
	successResponse(res, {
		statusCode: 200,
		code: 'PROFILE_FOUND',
		message: 'PROFILE_FOUND',
		ns: 'users',
		data: user,
	});
});

export const updateMyProfileController = asyncHandler(async (req, res) => {
	const validated = validate(UpdateMyProfileSchema, parseRequestData(req));

	const userId = res.locals.userId as string;
	const result = await updateMyProfile(
		userId,
		validated,
		getUploadedFile(req),
		userId,
	);
	successResponse(res, {
		statusCode: 200,
		code: 'PROFILE_UPDATED',
		message: 'PROFILE_UPDATED',
		ns: 'users',
		data: result.data,
		warnings: result.warnings,
	});
});

export const updateMyPreferencesController = asyncHandler(async (req, res) => {
	const validated = validate(UpdatePreferencesSchema, req.body);

	const userId = res.locals.userId as string;
	const preferences = await updateMyPreferences(userId, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'PREFERENCES_UPDATED',
		message: 'PREFERENCES_UPDATED',
		ns: 'users',
		data: preferences,
	});
});
