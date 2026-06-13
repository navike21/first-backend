import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { ListUsersQuerySchema } from '../schemas/user.schema';
import { listUsers } from '../application/listUsers';

export const listUsersController = asyncHandler(async (req, res) => {
	const validated = validate(ListUsersQuerySchema, req.query);

	const result = await listUsers(validated);
	successResponse(res, {
		statusCode: 200,
		code: 'USERS_LISTED',
		message: 'USERS_LISTED',
		ns: 'users',
		data: result,
	});
});
