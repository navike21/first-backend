import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { UpdateUserSchema } from '../schemas/user.schema';
import { updateUser } from '../application/updateUser';

export const updateUserController = asyncHandler(async (req, res) => {
	const parsed = UpdateUserSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
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
