import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { ListUsersQuerySchema } from '../schemas/user.schema';
import { listUsers } from '../application/listUsers';

export const listUsersController = asyncHandler(async (req, res) => {
	const parsed = ListUsersQuerySchema.safeParse(req.query);
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

	const result = await listUsers(parsed.data);
	successResponse(res, {
		statusCode: 200,
		code: 'USERS_LISTED',
		message: 'USERS_LISTED',
		ns: 'users',
		data: result,
	});
});
