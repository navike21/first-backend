import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { UpdateUserSchema } from '../schemas/user.schema';
import { updateUser } from '../application/updateUser';

export const updateUserController = asyncHandler(async (req, res) => {
	const parsed = UpdateUserSchema.safeParse(req.body);
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

	const user = await updateUser(String(req.params.id), parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'USER_UPDATED',
		message: 'USER_UPDATED',
		ns: 'users',
		data: user,
	});
});
