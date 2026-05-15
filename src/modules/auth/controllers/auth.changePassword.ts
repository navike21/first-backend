import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { ChangePasswordSchema } from '../schemas/auth.schema';
import { changePassword } from '../application/changePassword';

export const authChangePassword = asyncHandler(async (req, res) => {
	const parsed = ChangePasswordSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	await changePassword({
		userId: res.locals.userId as string,
		...parsed.data,
	});

	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_PASSWORD_CHANGED',
		message: 'AUTH_PASSWORD_CHANGED',
		ns: 'auth',
		data: null,
	});
});
