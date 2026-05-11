import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getUserById } from '../application/getUserById';

export const getUserByIdController = asyncHandler(async (req, res) => {
	const user = await getUserById(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		code: 'USER_FOUND',
		message: 'USER_FOUND',
		ns: 'users',
		data: user,
	});
});
