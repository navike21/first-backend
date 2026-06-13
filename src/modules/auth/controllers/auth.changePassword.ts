import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { ChangePasswordSchema } from '../schemas/auth.schema';
import { changePassword } from '../application/changePassword';

export const authChangePassword = asyncHandler(async (req, res) => {
	const validated = validate(ChangePasswordSchema, req.body);

	await changePassword({
		userId: res.locals.userId as string,
		...validated,
	});

	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_PASSWORD_CHANGED',
		message: 'AUTH_PASSWORD_CHANGED',
		ns: 'auth',
		data: null,
	});
});
