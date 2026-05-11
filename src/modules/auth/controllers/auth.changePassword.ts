import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { ChangePasswordSchema } from '../schemas/auth.schema';
import { changePassword } from '../application/changePassword';

export const authChangePassword = asyncHandler(async (req, res) => {
	const parsed = ChangePasswordSchema.safeParse(req.body);
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
