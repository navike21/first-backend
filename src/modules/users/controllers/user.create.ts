import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { CreateUserSchema } from '../schemas/user.schema';
import { createUser } from '../application/createUser';

export const createUserController = asyncHandler(async (req, res) => {
	const parsed = CreateUserSchema.safeParse(req.body);
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

	const data = await createUser(parsed.data);
	successResponse(res, {
		statusCode: 201,
		code: 'USER_CREATED',
		message: 'USER_CREATED',
		ns: 'users',
		data,
	});
});
