import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { CreateUserSchema } from '../schemas/user.schema';
import { createUser } from '../application/createUser';

export const createUserController = asyncHandler(async (req, res) => {
	const parsed = CreateUserSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', {
			validation: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	const data = await createUser(parsed.data, res.locals.lang as string);
	successResponse(res, {
		statusCode: 201,
		code: 'USER_CREATED',
		message: 'USER_CREATED',
		ns: 'users',
		data,
	});
});
