import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { UpdateMyProfileSchema } from '../schemas/user.schema';
import { getMyProfile } from '../application/getMyProfile';
import { updateMyProfile } from '../application/updateMyProfile';

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
	const parsed = UpdateMyProfileSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}

	const userId = res.locals.userId as string;
	const user = await updateMyProfile(userId, parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'PROFILE_UPDATED',
		message: 'PROFILE_UPDATED',
		ns: 'users',
		data: user,
	});
});
